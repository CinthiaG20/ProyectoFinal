import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import Table from '../../components/ui/Table.jsx';
import { useForecastsApi } from '../../hooks/api/useForecastsApi.js';
import { useMatchesApi } from '../../hooks/api/useMatchesApi.js';
import { useTournamentsApi } from '../../hooks/api/useTournamentsApi.js';

export default function MyForecasts() {
  const { listMyForecasts } = useForecastsApi();
  const { listMyTournaments, listMyMatches } = useTournamentsApi();
  const { getMatch } = useMatchesApi();

  const [forecasts, setForecasts] = useState([]);
  const [matchesMap, setMatchesMap] = useState({});
  const [tournamentsMap, setTournamentsMap] = useState({});
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await listMyForecasts();
        const myForecasts = Array.isArray(data) ? data : data.items ?? [];
        setForecasts(myForecasts);

        
        const matchIds = Array.from(new Set(myForecasts.map((f) => f.match)));
        const mMap = {};
        await Promise.all(matchIds.map(async (mid) => {
          try {
            const m = await getMatch(mid);
            mMap[mid] = m;
          } catch (err) {
            console.error('Error loading match', mid, err);
            mMap[mid] = null;
          }
        }));
        setMatchesMap(mMap);

        
        const tData = await listMyTournaments();
        const tournaments = Array.isArray(tData) ? tData : tData.items ?? [];
        const tMap = {};
        tournaments.forEach((t) => { tMap[t.id] = t; });
        setTournamentsMap(tMap);
        const upcomingMatches = [];
        await Promise.all(tournaments.map(async (t) => {
          try {
            const mlist = await listMyMatches(t.id);
            const arr = Array.isArray(mlist) ? mlist : mlist.items ?? [];
            arr.forEach((m) => upcomingMatches.push(m));
          } catch (err) {
            console.error('Error loading tournament matches', t.id, err);
          }
        }));

        // Filter future matches that don't have a forecast
        const now = new Date();
        const upcomingFiltered = upcomingMatches.filter((m) => {
          // treat matches without date as upcoming; include matches equal to now
          const isFuture = !m.date ? true : (new Date(m.date) >= now);
          return isFuture && !myForecasts.find((f) => f.match === m.id);
        });
        setUpcoming(upcomingFiltered);
      } catch (e) {
        console.error('Error loading forecasts', e);
        setError(e?.payload?.error || e.message || 'Error al cargar pronósticos');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Mis pronosticos</h2>
          <p className="page-subtitle">
            Revisa tus pronosticos y accede rapidamente a cada partido
          </p>
        </div>
        <div className="page-actions">
          <Link to="/gambler" className="btn btn-ghost">
            ← Inicio
          </Link>
        </div>
      </div>
      <ErrorMessage message={error} />

      {forecasts.length === 0 ? (
        <div className="table-shell">
          <div className="table-empty">No tienes pronosticos todavia.</div>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Partido</th>
              <th>Pronostico</th>
              <th>Torneo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f) => (
              <tr key={f.id}>
                <td>
                  {(matchesMap[f.match]?.teamA?.name ?? f.match)} vs{' '}
                  {(matchesMap[f.match]?.teamB?.name ?? '')}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {f.goalsA} – {f.goalsB}
                </td>
                <td>
                  <span className="table-badge">
                    {tournamentsMap[f.tournamentId]?.name ??
                      tournamentsMap[f.tournament]?.name ??
                      (f.tournamentId ?? f.tournament)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'center' }}>
                    <Link
                      to={`/gambler/matches/${f.match}`}
                      className="btn btn-ghost"
                    >
                      Ver partido
                    </Link>
                    <Link
                      to={`/gambler/matches/${f.match}?edit=true`}
                      className="btn btn-ghost"
                    >
                      Editar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {upcoming.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 className="page-title" style={{ fontSize: '0.96rem' }}>
            Proximos partidos sin pronostico
          </h3>
          <p className="page-subtitle" style={{ marginBottom: '0.6rem' }}>
            Aprovecha para completar tus pronosticos antes de que empiecen los partidos.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {upcoming.map((m) => (
              <li
                key={m.id}
                style={{
                  marginBottom: '0.45rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  alignItems: 'center',
                  fontSize: '0.86rem',
                }}
              >
                <span>
                  <strong>{m.name}</strong> – {m.teamA?.name ?? 'Equipo A'} vs{' '}
                  {m.teamB?.name ?? 'Equipo B'} ({m.date})
                </span>
                <Link to={`/gambler/matches/${m.id}`} className="btn btn-ghost">
                  Hacer pronostico
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
