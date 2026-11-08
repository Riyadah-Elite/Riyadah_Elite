import React, { useState, useEffect, useCallback } from 'react';
import { ThemeMode } from '../theme/theme';
import {
  GameItem,
  TournamentItem,
  BugReportItem,
  TesterRankingEntry,
} from '../utils/ecosystemRules';
import {
  gameService,
  tournamentService,
  bugReportService,
  leaderboardService,
} from '../services/api';
import {
  NexusShell,
  NexusDashboardView,
  NexusChatCollaborationView,
  NexusTournamentListingView,
  NexusBracketViewerView,
  NexusBugReportingView,
  NexusNotificationsView,
  NexusProfileDossierView,
  NexusGamesTestingView,
  NexusLeaderboardView,
} from './nexus';

export type NexusRoute =
  | 'dashboard'
  | 'games'
  | 'testing'
  | 'tournaments'
  | 'tournament-detail'
  | 'bracket-viewer'
  | 'bracket'
  | 'bug-reports'
  | 'bug-report'
  | 'chat'
  | 'leaderboard'
  | 'notifications'
  | 'profile';

export interface NexusWorkspaceProps {
  mode: ThemeMode;
  activeRoute: NexusRoute | string;
  preselectedGameId?: string;
  currentUser: {
    handle: string;
    email: string;
    role: 'Gamer & Playtester' | 'Game Developer' | 'Esports Organizer';
    tier: string;
  };
  onChangeRoute: (route: any) => void;
  onReturnToLanding: () => void;
  onDataMutated?: () => void;
}

export const NexusDashboardWorkspace: React.FC<NexusWorkspaceProps> = ({
  mode,
  activeRoute,
  preselectedGameId,
  currentUser,
  onChangeRoute,
  onReturnToLanding,
  onDataMutated = () => {},
}) => {
  const [games, setGames] = useState<GameItem[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [bugReports, setBugReports] = useState<BugReportItem[]>([]);
  const [testerRankings, setTesterRankings] = useState<TesterRankingEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [gData, tData, bData, lbData] = await Promise.all([
        gameService.getGames(),
        tournamentService.getTournaments(),
        bugReportService.getBugReports(),
        leaderboardService.getLeaderboards(),
      ]);
      setGames(gData.items);
      setEnrolledIds(gData.enrolledIds);
      setTournaments(tData.items);
      setRegisteredIds(tData.registeredIds);
      setBugReports(bData.items);
      setTesterRankings(lbData.testerRankings);
    } catch {
      // Fallback in case of mock service latency
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEnrollGame = async (id: string) => {
    const res = await gameService.togglePlaytestEnrollment(id);
    setEnrolledIds(res.enrolledIds);
    onDataMutated();
  };

  const handleRegisterTournament = async (id: string) => {
    const res = await tournamentService.toggleTournamentRegistration(id);
    setRegisteredIds(res.registeredIds);
    onDataMutated();
  };

  const handleSubmitBug = async (report: any) => {
    const res = await bugReportService.submitBugReport(report);
    setBugReports((prev) => [res.report, ...prev]);
    setTesterRankings(res.testerRankings);
    onDataMutated();
  };

  return (
    <NexusShell
      mode={mode}
      activeRoute={activeRoute}
      onChangeRoute={onChangeRoute}
      onReturnToLanding={onReturnToLanding}
      currentUser={currentUser}
    >
      {activeRoute === 'dashboard' && (
        <NexusDashboardView
          mode={mode}
          user={currentUser}
          games={games}
          tournaments={tournaments}
          bugReports={bugReports}
          testerRankings={testerRankings}
          enrolledGameIds={enrolledIds}
          registeredTournamentIds={registeredIds}
          onNavigate={onChangeRoute}
          onEnrollGame={handleEnrollGame}
        />
      )}

      {(activeRoute === 'games' || activeRoute === 'testing') && (
        <NexusGamesTestingView
          mode={mode}
          games={games}
          enrolledIds={enrolledIds}
          onEnrollGame={handleEnrollGame}
          onReportBug={(gId) => onChangeRoute('bug-reports')}
        />
      )}

      {(activeRoute === 'tournaments' || activeRoute === 'tournament-detail') && (
        <NexusTournamentListingView
          mode={mode}
          tournaments={tournaments}
          registeredIds={registeredIds}
          onRegister={handleRegisterTournament}
          onViewBracket={(tId) => onChangeRoute('bracket-viewer')}
        />
      )}

      {(activeRoute === 'bracket-viewer' || activeRoute === 'bracket' || activeRoute === 'brackets') && (
        <NexusBracketViewerView
          mode={mode}
          onBackToTournaments={() => onChangeRoute('tournaments')}
        />
      )}

      {(activeRoute === 'bug-reports' || activeRoute === 'bug-report') && (
        <NexusBugReportingView
          mode={mode}
          games={games}
          preselectedGameId={preselectedGameId}
          onSubmitBug={handleSubmitBug}
          recentBugReports={bugReports}
        />
      )}

      {(activeRoute === 'chat' || activeRoute === 'collaboration') && (
        <NexusChatCollaborationView
          mode={mode}
          user={currentUser}
        />
      )}

      {(activeRoute === 'leaderboard' || activeRoute === 'leaderboards') && (
        <NexusLeaderboardView
          mode={mode}
          rankings={testerRankings}
        />
      )}

      {(activeRoute === 'notifications' || activeRoute === 'notification') && (
        <NexusNotificationsView
          mode={mode}
        />
      )}

      {(activeRoute === 'profile' || activeRoute === 'dossier') && (
        <NexusProfileDossierView
          mode={mode}
          user={currentUser}
        />
      )}
    </NexusShell>
  );
};
