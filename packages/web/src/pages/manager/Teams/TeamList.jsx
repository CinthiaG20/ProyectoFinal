import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../../components/ui/ErrorMessage.jsx';
import Loading from '../../../components/ui/Loading.jsx';
import { useTeamsApi } from '../../../hooks/api/useTeamsApi.js';

export default function TeamList() {
  const { listTeams, deleteTeam } = useTeamsApi();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await listTeams();
        setTeams(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [listTeams]);

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar equipo?')) return;

    setDeleting(id);
    try {
      await deleteTeam(id);
      setTeams(prev => prev.filter(team => team.id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Equipos</h2>

      <button onClick={() => navigate('/manager/teams/new')}>
        Nuevo equipo
      </button>

      <ErrorMessage message={error} />

      <table style={{ width: '100%', background: '#fff' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Logo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {teams.map(t => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.description}</td>
              <td>
                {t.logo && (
                  <img
                    src={t.logo}
                    alt={t.name}
                    style={{ width: '40px', height: '40px' }}
                  />
                )}
              </td>
              <td>
                <Link to={`/manager/teams/${t.id}`}>Editar</Link>{' '}
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deleting === t.id}
                >
                  {deleting === t.id ? 'Eliminando…' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
