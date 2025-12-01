import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { useForecastsApi } from '../../hooks/api/useForecastsApi.js';
import { useTournamentsApi } from '../../hooks/api/useTournamentsApi.js';

export default function Leaderboard() {
  const { id } = useParams(); // tournamentId
  const { getLeaderboard } = useForecastsApi();
  const { getMyTournament } = useTournamentsApi();

  const [tournament, setTournament] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [t, lb] = await Promise.all([
          getMyTournament(id),
          getLeaderboard(id),
        ]);

        setTournament(t);
        setRows(Array.isArray(lb) ? lb : lb.items ?? []);
      } catch (e) {
        setError(e.message || 'Error al cargar tabla de posiciones');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, getLeaderboard, getMyTournament]);

  if (loading) return <Loading />;

  if (!tournament) {
    return <ErrorMessage message={error || 'Torneo no encontrado'} />;
  }

  const tableStyle = { width: '100%', background: '#fff', borderCollapse: 'collapse', tableLayout: 'fixed' };
  const thStyle = { padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'left' };
  const tdStyle = { padding: '0.5rem', verticalAlign: 'middle' };

  return (
    <div>
      <h2>Tabla de posiciones – {tournament.name}</h2>
      <p>
        <Link to={`/gambler/tournaments/${tournament.id}`}>
          ← Volver al torneo
        </Link>
      </p>

      <ErrorMessage message={error} />

      {rows.length === 0 ? (
        <p>No hay datos de puntuación aún.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: 'center', width: '10%' }}>Posición</th>
              <th style={{ ...thStyle, textAlign: 'left', width: '70%' }}>Usuario</th>
              <th style={{ ...thStyle, textAlign: 'right', width: '20%' }}>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, index) => (
              <tr key={r.userId ?? r.user ?? index} style={{ borderBottom: '1px solid #f6f6f6' }}>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{r.rank ?? (index + 1)}</td>
                <td style={{ ...tdStyle, textAlign: 'left' }}>{r.userEmail ?? r.userId}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
