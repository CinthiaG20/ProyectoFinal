import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
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
      <h2>Mis torneos</h2>
      <ErrorMessage message={error} />

      {tournaments.length === 0 ? (
        <div style={{ padding: '1rem', background: '#fff', borderRadius: 6 }}>
          <p>No tenés torneos asignados aún.</p>
          <p style={{ marginTop: '0.5rem' }}>
            Si esperás invitaciones, podés revisar <Link to="/gambler/invitations">Mis invitaciones</Link>.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {tournaments.map((t) => (
            <div key={t.id} style={{ padding: '1rem', background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '1.05rem' }}>{t.name}</strong>
                  <div style={{ fontSize: '0.9rem', color: '#555' }}>{t.description}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{t.startDate} – {t.endDate}</div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <Link to={`/gambler/tournaments/${t.id}`} style={{ padding: '0.4rem 0.6rem', background: '#2563eb', color: '#fff', borderRadius: 4, textDecoration: 'none' }}>Ver detalle</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
