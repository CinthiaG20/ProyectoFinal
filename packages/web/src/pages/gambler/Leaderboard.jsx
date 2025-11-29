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
        <table style={{ width: '100%', background: '#fff' }}>
          <thead>
            <tr>
              <th>Posición</th>
              <th>Usuario</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, index) => (
              <tr key={r.userId ?? r.user ?? index}>
                <td>{r.rank ?? (index + 1)}</td>
                <td>{r.userEmail ?? r.userId}</td>
                <td>{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
