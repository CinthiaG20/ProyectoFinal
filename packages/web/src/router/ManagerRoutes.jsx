import { Navigate, Route, Routes } from 'react-router-dom';
import ManagerLayout from '../components/layout/ManagerLayout.jsx';
import ManagerDashboard from '../pages/manager/ManagerDashboard.jsx';
import MatchForm from '../pages/manager/Matches/MatchForm.jsx';
import MatchList from '../pages/manager/Matches/MatchList.jsx';
import MatchResultForm from '../pages/manager/Matches/MatchResultForm.jsx';
import TeamForm from '../pages/manager/Teams/TeamForm.jsx';
import TeamList from '../pages/manager/Teams/TeamList.jsx';
import TournamentForm from '../pages/manager/Tournaments/TournamentForm.jsx';
import TournamentInvites from '../pages/manager/Tournaments/TournamentInvites.jsx';
import TournamentList from '../pages/manager/Tournaments/TournamentList.jsx';

export default function ManagerRoutes() {
  return (
    <ManagerLayout>
      <Routes>
        <Route path="/" element={<ManagerDashboard />} />

        <Route path="tournaments" element={<TournamentList />} />
        <Route path="tournaments/new" element={<TournamentForm />} />
        <Route path="tournaments/:id" element={<TournamentForm />} />
        <Route path="tournaments/:id/invites" element={<TournamentInvites />} />

        <Route path="teams" element={<TeamList />} />
        <Route path="teams/new" element={<TeamForm />} />
        <Route path="teams/:id" element={<TeamForm />} />

        <Route path="matches" element={<MatchList />} />
        <Route path="matches/new" element={<MatchForm />} />
        <Route path="matches/:id" element={<MatchForm />} />
        <Route path="matches/:id/result" element={<MatchResultForm />} />

        <Route path="*" element={<Navigate to="/manager" replace />} />
      </Routes>
    </ManagerLayout>
  );
}
