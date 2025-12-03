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
<<<<<<< HEAD
=======
        // Try to get tournament as "my tournament" (accepted access)
>>>>>>> main
        try {
          const data = await getMyTournament(id);
          setTournament(data);
          setHasAccess(true);
<<<<<<< HEAD
        } catch {
=======
        } catch (err) {
          // If not present in my tournaments, try generic tournament info
>>>>>>> main
          const data = await getTournament(id);
          setTournament(data);
          setHasAccess(false);
        }
<<<<<<< HEAD

        try {
          const lb = await getLeaderboard(id);
          const rows = Array.isArray(lb) ? lb : (lb.items ?? []);
          const me = rows.find(
            (r) =>
              r.user === user?.userId ||
              r.userId === user?.userId ||
              r.userEmail === user?.email
          );
          if (me) setMyScore(me.points ?? 0);
        } catch {
          // Silently ignore leaderboard errors
=======
        // Also try to fetch leaderboard and user's score
        try {
          const lb = await getLeaderboard(id);
          const rows = Array.isArray(lb) ? lb : lb.items ?? [];
          const me = rows.find((r) => r.user === user?.userId || r.userId === user?.userId || r.userEmail === user?.email);
          if (me) setMyScore(me.points ?? 0);
        } catch (err) {
          // ignore leaderboard errors here
>>>>>>> main
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
<<<<<<< HEAD
      const list = Array.isArray(invites) ? invites : (invites.items ?? []);
      const myInvite = list.find(
        (i) => i.tournament === id && !i.acceptedAt && !i.revokedAt
      );
      if (!myInvite) {
        setError('No hay invitacion pendiente para este torneo');
        return;
      }
      await acceptInvitation(myInvite.id);

      const data = await getMyTournament(id);
      setTournament(data);
      setHasAccess(true);

      try {
        const lb = await getLeaderboard(id);
        const rows = Array.isArray(lb) ? lb : (lb.items ?? []);
        const me = rows.find(
          (r) =>
            r.user === user?.userId ||
            r.userId === user?.userId ||
            r.userEmail === user?.email
        );
        if (me) setMyScore(me.points ?? 0);
      } catch {
        // Silently ignore leaderboard errors
      }
    } catch (err) {
      setError(err?.message || 'Error al aceptar la invitacion');
=======
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
>>>>>>> main
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
<<<<<<< HEAD
      <div className="page-header">
        <div>
          <h2 className="page-title">{tournament.name}</h2>
          <p className="page-subtitle">
            {tournament.description || 'Torneo sin descripcion'}
          </p>
        </div>
        <div className="page-actions">
          <Link to="/gambler/tournaments" className="btn btn-ghost">
            ← Volver a mis torneos
          </Link>
        </div>
      </div>

      <div className="app-card" style={{ marginBottom: '1rem' }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          <strong>Fechas:</strong> {tournament.startDate} – {tournament.endDate}
        </p>
        {typeof myScore === 'number' && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            <strong>Tu puntaje:</strong>{' '}
            <span className="table-badge table-badge-positive">
              {myScore} pts
            </span>
          </p>
        )}
      </div>

      {!hasAccess && (
        <div
          className="app-card"
          style={{
            marginBottom: '1rem',
            backgroundColor: '#fff3cd',
            borderColor: '#ffc107',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#856404' }}>
            No tienes acceso a este torneo. Si tienes una invitación pendiente,
            acéptala para ver los detalles.
          </p>
          <button
            onClick={handleAcceptFromDetail}
            className="btn btn-primary"
            style={{ marginTop: '0.5rem' }}
          >
            Aceptar invitación
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Link
          to={`/gambler/tournaments/${tournament.id}/matches`}
          className="btn btn-primary"
        >
          Ver partidos
        </Link>
        <Link
          to={`/gambler/tournaments/${tournament.id}/leaderboard`}
          className="btn btn-ghost"
        >
          Ver tabla de posiciones
        </Link>
      </div>
    </div>
  );
=======
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
>>>>>>> main
}
