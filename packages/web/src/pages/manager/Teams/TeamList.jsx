import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../../components/ui/ErrorMessage.jsx';
import Loading from '../../../components/ui/Loading.jsx';
<<<<<<< HEAD
import Table from '../../../components/ui/Table.jsx';
=======
>>>>>>> main
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
<<<<<<< HEAD
      setTeams((prev) => prev.filter((team) => team.id !== id));
=======
      setTeams(prev => prev.filter(team => team.id !== id));
>>>>>>> main
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
<<<<<<< HEAD
      <div className="page-header">
        <div>
          <h2 className="page-title">Equipos</h2>
          <p className="page-subtitle">Gestiona los equipos del torneo</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/manager/teams/new')}
          >
            Nuevo equipo
          </button>
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="app-card">
        <Table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Logo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 && (
              <tr>
                <td colSpan={4} className="table-empty">
                  No hay equipos aún
                </td>
              </tr>
            )}

            {teams.map((t) => (
              <tr key={t.id}>
                <td>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    {t.logo ? (
                      <img
                        src={t.logo}
                        alt={t.name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: 'rgba(34,197,94,0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        {t.name ? t.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.name}</div>
                      <div
                        className="table-cell-muted"
                        style={{ fontSize: 12 }}
                      >
                        {t.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{t.description}</td>
                <td>
                  {t.logo ? (
                    <img
                      src={t.logo}
                      alt={t.name}
                      style={{ width: 40, height: 40, borderRadius: 6 }}
                    />
                  ) : (
                    <span className="chip">Sin logo</span>
                  )}
                </td>
                <td>
                  <Link to={`/manager/teams/${t.id}`} className="btn btn-ghost">
                    Editar
                  </Link>{' '}
                  <button
                    className="btn btn-ghost-danger"
                    onClick={() => handleDelete(t.id)}
                    disabled={deleting === t.id}
                    style={{ marginLeft: 8 }}
                  >
                    {deleting === t.id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
=======
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
>>>>>>> main
    </div>
  );
}
