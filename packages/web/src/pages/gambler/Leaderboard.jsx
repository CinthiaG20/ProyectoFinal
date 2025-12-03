import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
<<<<<<< HEAD
import Table from '../../components/ui/Table.jsx';
=======
>>>>>>> main
import { useForecastsApi } from '../../hooks/api/useForecastsApi.js';
import { useTournamentsApi } from '../../hooks/api/useTournamentsApi.js';

export default function Leaderboard() {
<<<<<<< HEAD
  const { id } = useParams();
=======
  const { id } = useParams(); // tournamentId
>>>>>>> main
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
<<<<<<< HEAD
        setRows(Array.isArray(lb) ? lb : (lb.items ?? []));
=======
        setRows(Array.isArray(lb) ? lb : lb.items ?? []);
>>>>>>> main
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

<<<<<<< HEAD
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
=======
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
>>>>>>> main

      <ErrorMessage message={error} />

      {rows.length === 0 ? (
<<<<<<< HEAD
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
=======
        <p>No hay datos de puntuación aún.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: 'center', width: '10%' }}>Posición</th>
              <th style={{ ...thStyle, textAlign: 'left', width: '70%' }}>Usuario</th>
              <th style={{ ...thStyle, textAlign: 'right', width: '20%' }}>Puntos</th>
>>>>>>> main
            </tr>
          </thead>
          <tbody>
            {rows.map((r, index) => (
<<<<<<< HEAD
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
=======
              <tr key={r.userId ?? r.user ?? index} style={{ borderBottom: '1px solid #f6f6f6' }}>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{r.rank ?? (index + 1)}</td>
                <td style={{ ...tdStyle, textAlign: 'left' }}>{r.userEmail ?? r.userId}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
>>>>>>> main
      )}
    </div>
  );
}
