/**
 * User-facing notification copy, kept in one place so wording is consistent.
 *
 * @author aliasgarbootwala3@gmial.com
 */

export const NOTIFICATION_MESSAGES = {
  WELCOME: "Welcome! Your account has been created.",
  ACCOUNT_DELETED: "Your account has been deleted.",
  ACCOUNT_RESTORED: "Your account has been restored.",
  GAME_LISTING_CREATED: (gameName: string) =>
    `Game testing is live: ${gameName}. You can enroll now.`,
  TOURNAMENT_CREATED: (tournamentName: string) =>
    `Tournament is live: ${tournamentName}. You can enroll now.`,
  BUG_REPORT_CREATED: (username: string, gameName: string) =>
    `${username} submitted a new bug report for ${gameName}`,
  USER_JOINED_GAME_TESTING: (username: string, gameName: string) =>
    `${username} joined your game testing: ${gameName}`,
  USER_JOINED_TOURNAMENT: (username: string, tournamentName: string) =>
    `${username} registered for your tournament: ${tournamentName}`,
  TOURNAMENT_FULL: (tournamentName: string) =>
    `Your tournament is full: ${tournamentName}`,
  TESTING_PENDING: (gameName: string) =>
    `Your testing registration for ${gameName} is pending.`,
  TESTING_STARTED: (gameName: string) =>
    `Testing has started for ${gameName}.`,
  TESTING_COMPLETED: (gameName: string) =>
    `Testing for ${gameName} is complete. Your testing status is now completed.`,
  TESTING_FAILED: (gameName: string) =>
    `Your testing for ${gameName} was cancelled.`,
  TOURNAMENT_PENDING: (tournamentName: string) =>
    `Your registration for ${tournamentName} is pending.`,
  TOURNAMENT_STARTED: (tournamentName: string) =>
    `Your tournament ${tournamentName} is now in progress.`,
  TOURNAMENT_COMPLETED: (tournamentName: string) =>
    `Your tournament ${tournamentName} is complete.`,
  TOURNAMENT_FAILED: (tournamentName: string, exitReason?: string | null) =>
    exitReason
      ? `Your tournament ${tournamentName} was cancelled. Reason: ${exitReason}`
      : `Your tournament ${tournamentName} was cancelled.`,
  BUG_REPORT_STATUS_UPDATED: (gameName: string, status: string) =>
    `Your bug report for ${gameName} is now ${status}.`,
  TESTING_POINTS_UPDATED: (points: number, rank: string) =>
    `You now have ${points} testing points. Current rank: ${rank}.`,
} as const;
