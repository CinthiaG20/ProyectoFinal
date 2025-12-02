import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import Table from '../../components/ui/Table.jsx';
import { useTournamentsApi } from '../../hooks/api/useTournamentsApi.js';

export default function MyTournaments() {
  const { listMyTournaments } = useTournamentsApi();

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await listMyTournaments();
        setTournaments(Array.isArray(data) ? data : data.items ?? []);
      } catch (e) {
        setError(e.message || 'Error al cargar torneos');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [listMyTournaments]);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Mis torneos</h2>
          <p className="page-subtitle">
            Torneos en los que participas o a los que fuiste invitado
          </p>
        </div>
        <div className="page-actions">
          <Link to="/gambler" className="btn btn-ghost">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} />

      {tournaments.length === 0 ? (
        <div className="table-shell">
          <div className="table-empty">
            <p style={{ marginBottom: '0.3rem' }}>No tienes torneos asignados aun.</p>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Si esperas invitaciones, puedes revisar{' '}
              <Link to="/gambler/invitations">Mis invitaciones</Link>.
            </p>
          </div>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Rango de fechas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td className="table-cell-muted">
                  {t.description || 'Sin descripción'}
                </td>
                <td className="table-cell-muted">
                  {t.startDate} – {t.endDate}
                </td>
                <td>
                  <Link
                    to={`/gambler/tournaments/${t.id}`}
                    className="btn btn-ghost"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
