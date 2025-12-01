import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../../components/ui/ErrorMessage.jsx';
import Loading from '../../../components/ui/Loading.jsx';
import { useTournamentsApi } from '../../../hooks/api/useTournamentsApi.js';

export default function TournamentList() {
  const { listTournaments, deleteTournament } = useTournamentsApi();
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function loadData() {
    setLoading(true);
    try {
      const data = await listTournaments();
      setTournaments(Array.isArray(data) ? data : data.items ?? []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este torneo?')) return;
    setDeletingId(id);
    setError('');
    try {
      await deleteTournament(id);
      setTournaments(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Torneos</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate('/manager/tournaments/new')}>
          Nuevo torneo
        </button>
      </div>

      <ErrorMessage message={error} />

      {tournaments.length === 0 ? (
        <p>No hay torneos creados.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Fecha inicio</th>
              <th style={thStyle}>Fecha fin</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map(t => (
              <tr key={t.id}>
                <td style={tdStyle}>{t.id}</td>
                <td style={tdStyle}>{t.name}</td>
                <td style={tdStyle}>{t.startDate}</td>
                <td style={tdStyle}>{t.endDate}</td>
                <td style={tdStyle}>
                  <Link to={`/manager/tournaments/${t.id}`}>Editar</Link>
                  {' | '}
                  <Link to={`/manager/tournaments/${t.id}/invites`}>
                    Invitaciones
                  </Link>
                  {' | '}
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    {deletingId === t.id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff',
};

const thStyle = {
  padding: '0.5rem',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
};

const tdStyle = {
  padding: '0.5rem',
  borderBottom: '1px solid #eee',
};
