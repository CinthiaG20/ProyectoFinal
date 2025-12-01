import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { useForecastsApi } from '../../hooks/api/useForecastsApi.js';
import { useInvitationsApi } from '../../hooks/api/useInvitationsApi.js';
import { useTournamentsApi } from '../../hooks/api/useTournamentsApi.js';

export default function TournamentDetail() {
  const { id } = useParams();
  const { getMyTournament } = useTournamentsApi();
  const { getLeaderboard } = useForecastsApi();
  const { getTournament } = useTournamentsApi();
  const { listInvitations, acceptInvitation } = useInvitationsApi();
  const { user } = useAuth();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myScore, setMyScore] = useState(null);
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        // Try to get tournament as "my tournament" (accepted access)
        try {
          const data = await getMyTournament(id);
          setTournament(data);
          setHasAccess(true);
        } catch (err) {
          // If not present in my tournaments, try generic tournament info
          const data = await getTournament(id);
          setTournament(data);
          setHasAccess(false);
        }
        // Also try to fetch leaderboard and user's score
        try {
          const lb = await getLeaderboard(id);
          const rows = Array.isArray(lb) ? lb : lb.items ?? [];
          const me = rows.find((r) => r.user === user?.userId || r.userId === user?.userId || r.userEmail === user?.email);
          if (me) setMyScore(me.points ?? 0);
        } catch (err) {
          // ignore leaderboard errors here
        }
      } catch (e) {
        setError(e.message || 'Error al cargar torneo');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, getMyTournament, getTournament, getLeaderboard, user]);

  async function handleAcceptFromDetail() {
    setLoading(true);
    setError('');
    try {
      const invites = await listInvitations();
      const list = Array.isArray(invites) ? invites : invites.items ?? [];
      const myInvite = list.find((i) => i.tournament === id && !i.acceptedAt && !i.revokedAt);
      if (!myInvite) {
        setError('No hay invitación pendiente para este torneo');
        return;
      }
      await acceptInvitation(myInvite.id);
      // After accepting, reload as myTournament
      const data = await getMyTournament(id);
      setTournament(data);
      setHasAccess(true);
      // Try to refresh leaderboard/scores
      try {
        const lb = await getLeaderboard(id);
        const rows = Array.isArray(lb) ? lb : lb.items ?? [];
        const me = rows.find((r) => r.user === user?.userId || r.userId === user?.userId || r.userEmail === user?.email);
        if (me) setMyScore(me.points ?? 0);
      } catch {}
    } catch (err) {
      setError(err?.message || 'Error al aceptar la invitación');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  if (!tournament) {
    return <ErrorMessage message={error || 'Torneo no encontrado'} />;
  }

  return (
    <div>
      <h2>{tournament.name}</h2>
      <p>{tournament.description}</p>
      <p>
        <strong>Fechas:</strong> {tournament.startDate} – {tournament.endDate}
      </p>

      <p>
        <Link to="/gambler/tournaments">← Volver a mis torneos</Link>
      </p>

      <ul>
        <li>
          <Link to={`/gambler/tournaments/${tournament.id}/matches`}>
            Ver partidos
          </Link>
        </li>
        <li>
          <Link to={`/gambler/tournaments/${tournament.id}/leaderboard`}>
            Ver tabla de posiciones
          </Link>
        </li>
        {typeof myScore === 'number' && (
          <li>
            <strong>Tu puntaje:</strong> {myScore}
          </li>
        )}
      </ul>
    </div>
  );

  async function handleAcceptFromDetail() {
    setLoading(true);
    setError('');
    try {
      const invites = await listInvitations();
      const list = Array.isArray(invites) ? invites : invites.items ?? [];
      const myInvite = list.find((i) => i.tournament === id && !i.acceptedAt && !i.revokedAt);
      if (!myInvite) {
        setError('No hay invitación pendiente para este torneo');
        return;
      }
      await acceptInvitation(myInvite.id);
      // After accepting, reload as myTournament
      const data = await getMyTournament(id);
      setTournament(data);
      setHasAccess(true);
      // Try to refresh leaderboard/scores
      try {
        const lb = await getLeaderboard(id);
        const rows = Array.isArray(lb) ? lb : lb.items ?? [];
        const me = rows.find((r) => r.user === user?.userId || r.userId === user?.userId || r.userEmail === user?.email);
        if (me) setMyScore(me.points ?? 0);
      } catch {}
    } catch (err) {
      setError(err?.message || 'Error al aceptar la invitación');
    } finally {
      setLoading(false);
    }
  }
}
