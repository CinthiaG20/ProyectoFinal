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
      <h2>Mis pronósticos</h2>
      <ErrorMessage message={error} />

      {forecasts.length === 0 ? (
        <div style={{ padding: '1rem', background: '#fff', borderRadius: 6 }}>
          <p>No tenés pronósticos todavía.</p>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>Partido</th>
              <th style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>Pronóstico</th>
              <th style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>Torneo</th>
              <th style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f) => (
              <tr key={f.id} style={{ borderBottom: '1px solid #f6f6f6' }}>
                <td style={{ padding: '0.5rem' }}>{(matchesMap[f.match]?.teamA?.name ?? f.match)} vs {(matchesMap[f.match]?.teamB?.name ?? '')}</td>
                <td style={{ padding: '0.5rem' }}>{f.goalsA} - {f.goalsB}</td>
                <td style={{ padding: '0.5rem' }}>{tournamentsMap[f.tournamentId]?.name ?? tournamentsMap[f.tournament]?.name ?? (f.tournamentId ?? f.tournament)}</td>
                <td style={{ padding: '0.5rem' }}>
                  <Link to={`/gambler/matches/${f.match}`} style={{ color: '#2563eb' }}>Ver partido</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {upcoming.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Próximos partidos sin pronóstico</h3>
          <ul>
            {upcoming.map((m) => (
              <li key={m.id} style={{ marginBottom: '0.5rem' }}>
                <strong>{m.name}</strong> – {m.teamA?.name ?? 'Equipo A'} vs {m.teamB?.name ?? 'Equipo B'} ({m.date}) {' '}
                <Link to={`/gambler/matches/${m.id}`} style={{ color: '#2563eb' }}>Hacer pronóstico</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
