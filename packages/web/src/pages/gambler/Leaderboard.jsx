import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import Table from '../../components/ui/Table.jsx';
import { useForecastsApi } from '../../hooks/api/useForecastsApi.js';
import { useTournamentsApi } from '../../hooks/api/useTournamentsApi.js';

export default function Leaderboard() {
  const { id } = useParams();
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
        setRows(Array.isArray(lb) ? lb : (lb.items ?? []));
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
      <div className="page-header">
        <div>
          <h2 className="page-title">Tabla de posiciones</h2>
          <p className="page-subtitle">
            {tournament.name} · {tournament.startDate} – {tournament.endDate}
          </p>
        </div>
        <div className="page-actions">
          <Link
            to={`/gambler/tournaments/${tournament.id}`}
            className="btn btn-ghost"
          >
            ← Volver al torneo
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} />

      {rows.length === 0 ? (
        <div className="table-shell">
          <div className="table-empty">No hay datos de puntuacion aun.</div>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th style={{ textAlign: 'center', width: '10%' }}>Posicion</th>
              <th style={{ textAlign: 'left' }}>Usuario</th>
              <th style={{ textAlign: 'right', width: '20%' }}>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, index) => (
              <tr key={r.userId ?? r.user ?? index}>
                <td style={{ textAlign: 'center' }}>
                  <span className="table-badge">{r.rank ?? index + 1}</span>
                </td>
                <td>{r.userEmail ?? r.userId}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className="table-badge table-badge-positive">
                    {r.points} pts
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
