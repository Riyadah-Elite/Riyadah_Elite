/**
 * Testing and tournament progress for USER accounts.
 *
 * Progress is stored on the user, not on each enrollment, so every transition
 * is applied to that single row and notifications are sent only when the
 * stored value actually changes.
 *
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { NOTIFICATION_MESSAGES } from "../constants/notification.js";
import { notifySystem } from "../utils/notification.js";
import {
  rankForPoints,
} from "../utils/rank.js";
import Logger from "../utils/logger.js";
import UserProgressRepository from "../repositories/userprogress.repository.js";
import type {
  GameProgressCandidate,
  TournamentProgressCandidate,
} from "../repositories/userprogress.repository.js";
import type {
  TestingStatus,
  TournamentStatus,
} from "../types/user.types.js";
import { POINTS_PER_COMPLETED_BUG_REPORT } from "../constants/constants.js";

type MutableTestingStatus = "inprogress" | "completed";
type MutableTournamentStatus = "inprogress" | "completed";

const STATUS_PRIORITY: Record<string, number> = {
  pending: 0,
  inprogress: 1,
  completed: 2,
  failure: 3,
};

@injectable()
export default class UserProgressService {
  @inject(TYPES.UserProgressRepository)
  userProgressRepository!: UserProgressRepository;

  @inject(TYPES.Logger)
  logger!: Logger;

  /**
   * Applies time-driven status changes for joined games and tournaments.
   * Idempotent: once a user reaches a state, later calls do not notify again.
   */
  async syncStatuses(userId?: string): Promise<void> {
    const now = new Date();

    const [games, tournaments] = await Promise.all([
      this.userProgressRepository.listGameProgressCandidates(userId),
      this.userProgressRepository.listTournamentProgressCandidates(userId),
    ]);

    await this.syncTestingStatuses(games, now);
    await this.syncTournamentStatuses(tournaments, now);
  }

  async markGamePending(userId: string, gameName: string) {
    const before = await this.userProgressRepository.findProgress(userId);

    await this.userProgressRepository.setTestingStatus(userId, "pending");

    if (before?.testingStatus !== "pending") {
      await notifySystem(
        userId,
        NOTIFICATION_MESSAGES.TESTING_PENDING(gameName),
      );
    }
  }

  async markTournamentPending(userId: string, tournamentName: string) {
    const before = await this.userProgressRepository.findProgress(userId);

    await this.userProgressRepository.resetTournamentToPending(userId);

    if (before?.tournamentStatus !== "pending") {
      await notifySystem(
        userId,
        NOTIFICATION_MESSAGES.TOURNAMENT_PENDING(tournamentName),
      );
    }
  }

  /** A bug report is the point where a pending tester becomes active. */
  async markTestingInProgress(userId: string, gameName: string) {
    const before = await this.userProgressRepository.findProgress(userId);

    if (before?.testingStatus && before.testingStatus !== "pending") {
      return;
    }

    await this.userProgressRepository.setTestingStatus(userId, "inprogress");
    await notifySystem(
      userId,
      NOTIFICATION_MESSAGES.TESTING_STARTED(gameName),
    );
  }

  async markGameFailure(userId: string, gameName: string) {
    const before = await this.userProgressRepository.findProgress(userId);

    await this.userProgressRepository.setTestingStatus(userId, "failure");

    if (before?.testingStatus !== "failure") {
      await notifySystem(
        userId,
        NOTIFICATION_MESSAGES.TESTING_FAILED(gameName),
      );
    }
  }

  async markTournamentFailure(
    userId: string,
    tournamentName: string,
    exitReason?: string | null,
  ) {
    const before = await this.userProgressRepository.findProgress(userId);
    const reason = exitReason?.trim() || null;

    await this.userProgressRepository.setTournamentStatus(
      userId,
      "failure",
      reason,
    );

    if (
      before?.tournamentStatus !== "failure" ||
      before.exitReason !== reason
    ) {
      await notifySystem(
        userId,
        NOTIFICATION_MESSAGES.TOURNAMENT_FAILED(tournamentName, reason),
      );
    }
  }

  /**
   * Recomputes points from completed bug reports instead of incrementing a
   * counter. This keeps the reward idempotent when a report changes status more
   * than once.
   */
  async recalculateTestingPoints(userId: string) {
    const completed =
      await this.userProgressRepository.countCompletedBugReports(userId);

    const points = completed * POINTS_PER_COMPLETED_BUG_REPORT;
    const rank = rankForPoints(points);
    const before = await this.userProgressRepository.findProgress(userId);
    const earned = points - (before?.testingPoints ?? 0);

    if (
      before &&
      (before.testingPoints !== points || before.testingRank !== rank)
    ) {
      await this.userProgressRepository.setPointsAndRank(userId, points, rank);
    }

    return { points, rank, earned };
  }

  /** Backfills ranks for rows created before ranks existed. */
  async ensureRank(userId: string): Promise<void> {
    const progress = await this.userProgressRepository.findProgress(userId);

    if (!progress) {
      return;
    }

    const rank = rankForPoints(progress.testingPoints);

    if (progress.testingRank !== rank) {
      await this.userProgressRepository.setPointsAndRank(
        userId,
        progress.testingPoints ?? 0,
        rank,
      );
    }
  }

  private async syncTestingStatuses(
    candidates: GameProgressCandidate[],
    now: Date,
  ): Promise<void> {
    const transitions = new Map<
      string,
      { status: MutableTestingStatus; gameName: string }
    >();

    for (const candidate of candidates) {
      const current = candidate.testingStatus;

      if (current === "completed" || current === "failure") {
        continue;
      }

      let next: MutableTestingStatus | null = null;

      if (candidate.testingDeadline.getTime() <= now.getTime()) {
        next = "completed";
      } else if (
        candidate.registrationEndDate.getTime() <= now.getTime() &&
        (current === null || current === "pending")
      ) {
        next = "inprogress";
      }

      if (!next) {
        continue;
      }

      const existing = transitions.get(candidate.userId);

      if (
        !existing ||
        STATUS_PRIORITY[next] > STATUS_PRIORITY[existing.status]
      ) {
        transitions.set(candidate.userId, {
          status: next,
          gameName: candidate.gameName,
        });
      }
    }

    await this.applyTestingTransitions(transitions);
  }

  private async syncTournamentStatuses(
    candidates: TournamentProgressCandidate[],
    now: Date,
  ): Promise<void> {
    const transitions = new Map<
      string,
      { status: MutableTournamentStatus; tournamentName: string }
    >();

    for (const candidate of candidates) {
      const current = candidate.tournamentStatus;

      if (current === "completed" || current === "failure") {
        continue;
      }

      const eventTime = this.latestDate(
        candidate.tournamentDate,
        candidate.tournamentTime,
      );

      let next: MutableTournamentStatus | null = null;

      if (eventTime && eventTime.getTime() <= now.getTime()) {
        next = "completed";
      } else if (
        candidate.registrationEndDate &&
        candidate.registrationEndDate.getTime() <= now.getTime() &&
        (current === null || current === "pending")
      ) {
        next = "inprogress";
      }

      if (!next) {
        continue;
      }

      const existing = transitions.get(candidate.userId);

      if (
        !existing ||
        STATUS_PRIORITY[next] > STATUS_PRIORITY[existing.status]
      ) {
        transitions.set(candidate.userId, {
          status: next,
          tournamentName: candidate.tournamentName,
        });
      }
    }

    await this.applyTournamentTransitions(transitions);
  }

  private async applyTestingTransitions(
    transitions: Map<
      string,
      { status: MutableTestingStatus; gameName: string }
    >,
  ) {
    const inprogress: string[] = [];
    const completed: string[] = [];

    for (const [userId, transition] of transitions) {
      if (transition.status === "completed") {
        completed.push(userId);
      } else {
        inprogress.push(userId);
      }
    }

    await this.userProgressRepository.setTestingStatuses(
      inprogress,
      "inprogress",
    );
    await this.userProgressRepository.setTestingStatuses(
      completed,
      "completed",
    );

    for (const [userId, transition] of transitions) {
      await notifySystem(
        userId,
        transition.status === "completed"
          ? NOTIFICATION_MESSAGES.TESTING_COMPLETED(transition.gameName)
          : NOTIFICATION_MESSAGES.TESTING_STARTED(transition.gameName),
      );
    }

    if (transitions.size > 0) {
      this.logger.info("testing statuses synced", {
        inprogress: inprogress.length,
        completed: completed.length,
      });
    }
  }

  private async applyTournamentTransitions(
    transitions: Map<
      string,
      { status: MutableTournamentStatus; tournamentName: string }
    >,
  ) {
    const inprogress: string[] = [];
    const completed: string[] = [];

    for (const [userId, transition] of transitions) {
      if (transition.status === "completed") {
        completed.push(userId);
      } else {
        inprogress.push(userId);
      }
    }

    await this.userProgressRepository.setTournamentStatuses(
      inprogress,
      "inprogress",
    );
    await this.userProgressRepository.setTournamentStatuses(
      completed,
      "completed",
    );

    for (const [userId, transition] of transitions) {
      await notifySystem(
        userId,
        transition.status === "completed"
          ? NOTIFICATION_MESSAGES.TOURNAMENT_COMPLETED(transition.tournamentName)
          : NOTIFICATION_MESSAGES.TOURNAMENT_STARTED(transition.tournamentName),
      );
    }

    if (transitions.size > 0) {
      this.logger.info("tournament statuses synced", {
        inprogress: inprogress.length,
        completed: completed.length,
      });
    }
  }

  private latestDate(...dates: (Date | null)[]): Date | null {
    const valid = dates.filter((date): date is Date => date !== null);

    if (valid.length === 0) {
      return null;
    }

    return new Date(Math.max(...valid.map((date) => date.getTime())));
  }
  
}
