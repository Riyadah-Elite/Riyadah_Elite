import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { GameTestingDiscoveryPage } from "./pages/GameTestingDiscoveryPage";
import { GameTestingDetailsPage } from "./pages/GameTestingDetailsPage";
import { GameTestingApplicationPage } from "./pages/GameTestingApplicationPage";
import { TournamentDiscoveryPage } from "./pages/TournamentDiscoveryPage";
import { TournamentDetailsPage } from "./pages/TournamentDetailsPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/games" element={<GameTestingDiscoveryPage />} />
        <Route path="/games/cyber-strike" element={<GameTestingDetailsPage />} />
        <Route path="/games/cyber-strike/apply" element={<GameTestingApplicationPage />} />
        <Route path="/tournaments" element={<TournamentDiscoveryPage />} />
        <Route path="/tournaments/valorant-community-cup" element={<TournamentDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
