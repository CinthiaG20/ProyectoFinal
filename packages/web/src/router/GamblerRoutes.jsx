import { Navigate, Route, Routes } from 'react-router-dom';
import GamblerLayout from '../components/layout/GamblerLayout.jsx';
import GamblerDashboard from '../pages/gambler/GamblerDashboard.jsx';
import Invitations from '../pages/gambler/Invitations.jsx';
import Leaderboard from '../pages/gambler/Leaderboard.jsx';
import MatchDetail from '../pages/gambler/MatchDetail.jsx';
import MyForecasts from '../pages/gambler/MyForecasts.jsx';
import MyTournaments from '../pages/gambler/MyTournaments.jsx';
import TournamentDetail from '../pages/gambler/TournamentDetail.jsx';
import TournamentMatches from '../pages/gambler/TournamentMatches.jsx';

export default function GamblerRoutes() {
  return (
    <GamblerLayout>
      <Routes>
        <Route path="/" element={<GamblerDashboard />} />
        <Route path="tournaments" element={<MyTournaments />} />
        <Route path="tournaments/:id" element={<TournamentDetail />} />
        <Route
          path="tournaments/:id/matches"
          element={<TournamentMatches />}
        />
        <Route path="matches/:id" element={<MatchDetail />} />
        <Route path="invitations" element={<Invitations />} />
        <Route path="forecasts" element={<MyForecasts />} />
        <Route path="tournaments/:id/leaderboard" element={<Leaderboard />} />

        <Route path="*" element={<Navigate to="/gambler" replace />} />
      </Routes>
    </GamblerLayout>
  );
}
