import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "./components/layout/PublicLayout";
import { PlayerLayout } from "./components/layout/PlayerLayout";
import { DeveloperLayout } from "./components/layout/DeveloperLayout";
import { LandingPage } from "./pages/LandingPage";
import { GameTestingDiscoveryPage } from "./pages/GameTestingDiscoveryPage";
import { GameTestingDetailsPage } from "./pages/GameTestingDetailsPage";
import { GameTestingApplicationPage } from "./pages/GameTestingApplicationPage";
import { TournamentDiscoveryPage } from "./pages/TournamentDiscoveryPage";
import { TournamentDetailsPage } from "./pages/TournamentDetailsPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { ForDevelopersPage } from "./pages/ForDevelopersPage";
import { GameRightsOwnershipPage } from "./pages/GameRightsOwnershipPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { AccountCreatedSuccessPage } from "./pages/AccountCreatedSuccessPage";
import { PasswordChangedSuccessPage } from "./pages/PasswordChangedSuccessPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Player Workspace Pages
import { PlayerDashboardPage } from "./pages/PlayerDashboardPage";
import { GameTestingDashboardPage } from "./pages/GameTestingDashboardPage";
import { PlayerTournamentsPage } from "./pages/PlayerTournamentsPage";
import { PlayerProfilePage } from "./pages/PlayerProfilePage";
import { PlayerSettingsPage } from "./pages/PlayerSettingsPage";
import { TournamentRegistrationPage } from "./pages/TournamentRegistrationPage";

// Developer Workspace Pages (Phase 3A)
import { DeveloperOverviewPage } from "./pages/developer/DeveloperOverviewPage";
import { DeveloperMyGamesPage } from "./pages/developer/DeveloperMyGamesPage";
import { DeveloperAddGamePage } from "./pages/developer/DeveloperAddGamePage";
import { DeveloperGameDetailsPage } from "./pages/developer/DeveloperGameDetailsPage";
import { DeveloperTestingCampaignsPage } from "./pages/developer/DeveloperTestingCampaignsPage";
import { DeveloperCampaignDetailsPage } from "./pages/developer/DeveloperCampaignDetailsPage";
import { DeveloperTestersPage } from "./pages/developer/DeveloperTestersPage";
import { DeveloperFeedbackPage } from "./pages/developer/DeveloperFeedbackPage";
import { DeveloperPaymentsPage } from "./pages/developer/DeveloperPaymentsPage";
import { DeveloperVerificationPage } from "./pages/developer/DeveloperVerificationPage";
import { DeveloperProfilePage } from "./pages/developer/DeveloperProfilePage";
import { DeveloperSettingsPage } from "./pages/developer/DeveloperSettingsPage";
import { DeveloperSupportPage } from "./pages/developer/DeveloperSupportPage";

// Tournament Host Workspace Pages (Phase 4A)
import { HostLayout } from "./components/layout/HostLayout";
import { HostOverviewPage } from "./pages/host/HostOverviewPage";
import { HostMyTournamentsPage } from "./pages/host/HostMyTournamentsPage";
import { HostTournamentManagementPage } from "./pages/host/HostTournamentManagementPage";
import { HostResultsParticipantsPage } from "./pages/host/HostResultsParticipantsPage";
import { HostProfileSettingsPage } from "./pages/host/HostProfileSettingsPage";

// Internal Admin Workspace Pages (Phase 5A)
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminFounderCommandPage } from "./pages/admin/AdminFounderCommandPage";
import { AdminViceCommandPage } from "./pages/admin/AdminViceCommandPage";
import { AdminUserManagementPage } from "./pages/admin/AdminUserManagementPage";
import { AdminDeveloperManagementPage } from "./pages/admin/AdminDeveloperManagementPage";
import { AdminTournamentArbiterPage } from "./pages/admin/AdminTournamentArbiterPage";
import { AdminFinancePage } from "./pages/admin/AdminFinancePage";
import { AdminTrustSafetyPage } from "./pages/admin/AdminTrustSafetyPage";
import { AdminVerificationPage } from "./pages/admin/AdminVerificationPage";
import { AdminHrPeopleCulturePage } from "./pages/admin/AdminHrPeopleCulturePage";
import { AdminPlatformOpsPage } from "./pages/admin/AdminPlatformOpsPage";
import { AdminContentManagementPage } from "./pages/admin/AdminContentManagementPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authenticated Internal Admin Workspace (Phase 5A) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/founder" replace />} />
          <Route path="founder" element={<AdminFounderCommandPage />} />
          <Route path="command-center" element={<AdminFounderCommandPage />} />
          <Route path="vice-command" element={<AdminViceCommandPage />} />
          <Route path="users" element={<AdminUserManagementPage />} />
          <Route path="developers" element={<AdminDeveloperManagementPage />} />
          <Route path="tournaments" element={<AdminTournamentArbiterPage />} />
          <Route path="finance" element={<AdminFinancePage />} />
          <Route path="trust-safety" element={<AdminTrustSafetyPage />} />
          <Route path="verification" element={<AdminVerificationPage />} />
          <Route path="hr" element={<AdminHrPeopleCulturePage />} />
          <Route path="platform-ops" element={<AdminPlatformOpsPage />} />
          <Route path="content" element={<AdminContentManagementPage />} />
        </Route>

        {/* Authenticated Tournament Host Workspace */}
        <Route path="/host" element={<HostLayout />}>
          <Route index element={<Navigate to="/host/dashboard" replace />} />
          <Route path="dashboard" element={<HostOverviewPage />} />
          <Route path="tournaments" element={<HostMyTournamentsPage />} />
          <Route path="tournaments/new" element={<HostTournamentManagementPage />} />
          <Route path="tournaments/:id/manage" element={<HostTournamentManagementPage />} />
          <Route path="tournaments/:id/results" element={<HostResultsParticipantsPage />} />
          <Route path="results" element={<HostResultsParticipantsPage />} />
          <Route path="profile" element={<HostProfileSettingsPage />} />
        </Route>

        {/* Authenticated Developer Workspace */}
        <Route path="/developer" element={<DeveloperLayout />}>
          <Route index element={<Navigate to="/developer/dashboard" replace />} />
          <Route path="dashboard" element={<DeveloperOverviewPage />} />
          <Route path="games" element={<DeveloperMyGamesPage />} />
          <Route path="games/new" element={<DeveloperAddGamePage />} />
          <Route path="games/:id" element={<DeveloperGameDetailsPage />} />
          <Route path="campaigns" element={<DeveloperTestingCampaignsPage />} />
          <Route path="campaigns/:id" element={<DeveloperCampaignDetailsPage />} />
          <Route path="testers" element={<DeveloperTestersPage />} />
          <Route path="feedback" element={<DeveloperFeedbackPage />} />
          <Route path="earnings" element={<DeveloperPaymentsPage />} />
          <Route path="verification" element={<DeveloperVerificationPage />} />
          <Route path="profile" element={<DeveloperProfilePage />} />
          <Route path="settings" element={<DeveloperSettingsPage />} />
          <Route path="support" element={<DeveloperSupportPage />} />
        </Route>


        {/* Authenticated Player Workspace */}
        <Route path="/player" element={<PlayerLayout />}>
          <Route index element={<Navigate to="/player/dashboard" replace />} />
          <Route path="dashboard" element={<PlayerDashboardPage />} />
          <Route path="game-testing" element={<GameTestingDashboardPage />} />
          <Route path="tournaments" element={<PlayerTournamentsPage />} />
          <Route path="profile" element={<PlayerProfilePage />} />
          <Route path="settings" element={<PlayerSettingsPage />} />
        </Route>

        {/* Public Marketing & Catalog */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/games" element={<GameTestingDiscoveryPage />} />
          <Route path="/games/:id" element={<GameTestingDetailsPage />} />
          <Route path="/games/:id/apply" element={<GameTestingApplicationPage />} />
          <Route path="/tournaments" element={<TournamentDiscoveryPage />} />
          <Route path="/tournaments/:id" element={<TournamentDetailsPage />} />
          <Route path="/tournaments/:id/register" element={<TournamentRegistrationPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/for-developers" element={<ForDevelopersPage />} />
          <Route path="/game-rights-ownership" element={<GameRightsOwnershipPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/account-created-success" element={<AccountCreatedSuccessPage />} />
          <Route path="/password-changed-success" element={<PasswordChangedSuccessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
