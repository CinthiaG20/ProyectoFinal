<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { useTeamsApi } from '../../hooks/api/useTeamsApi.js';
import { useTournamentsApi } from '../../hooks/api/useTournamentsApi.js';

export default function ManagerDashboard() {
  const { listTournaments } = useTournamentsApi();
  const { listTeams } = useTeamsApi();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tournamentsCount, setTournamentsCount] = useState(0);
  const [teamsCount, setTeamsCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [tournaments, teams] = await Promise.all([
          listTournaments(),
          listTeams(),
        ]);
        if (!mounted) return;
        setTournamentsCount(
          Array.isArray(tournaments) ? tournaments.length : 0
        );
        setTeamsCount(Array.isArray(teams) ? teams.length : 0);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message ?? String(e));
      }

      if (mounted) {
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [listTournaments, listTeams]);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Panel del Manager</h2>
          <p className="page-subtitle">
            Desde aqui se gestionan torneos, equipos y partidos
          </p>
        </div>
      </div>

      <ErrorMessage message={error} />

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <section className="app-card" style={{ minWidth: 220 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                Torneos
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                {tournamentsCount}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <Link to="/manager/tournaments" className="btn btn-ghost">
                Ver
              </Link>
              <Link to="/manager/tournaments/new" className="btn btn-primary">
                Nuevo
              </Link>
            </div>
          </div>
        </section>

        <section className="app-card" style={{ minWidth: 220 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                Equipos
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                {teamsCount}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <Link to="/manager/teams" className="btn btn-ghost">
                Ver
              </Link>
              <Link to="/manager/teams/new" className="btn btn-primary">
                Nuevo
              </Link>
            </div>
          </div>
        </section>

        <section className="app-card" style={{ minWidth: 220 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                Partidos
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>—</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <Link to="/manager/matches" className="btn btn-ghost">
                Ver
              </Link>
              <Link to="/manager/matches/new" className="btn btn-primary">
                Nuevo
              </Link>
            </div>
          </div>
        </section>
      </div>
=======
export default function ManagerDashboard() {
  return (
    <div>
      <h1>Panel del Manager</h1>
      <p>Desde aquí se gestionan torneos, equipos y partidos.</p>
>>>>>>> main
    </div>
  );
}
