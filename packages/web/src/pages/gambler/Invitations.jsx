import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { useToast } from '../../components/ui/ToastContext.jsx';
import { useInvitationsApi } from '../../hooks/api/useInvitationsApi.js';
import { useTournamentsApi } from '../../hooks/api/useTournamentsApi.js';

export default function Invitations() {
  const { listInvitations, acceptInvitation, rejectInvitation } = useInvitationsApi();

  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(null);
  const [tournamentNames, setTournamentNames] = useState({});

  const { getTournament } = useTournamentsApi();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await listInvitations();
        const invitesList = Array.isArray(data) ? data : data.items ?? [];
        setInvites(invitesList);
        
        const tids = Array.from(new Set(invitesList.map((i) => i.tournament)));
        const map = {};
        await Promise.all(tids.map(async (tid) => {
          try {
            const t = await getTournament(tid);
            map[tid] = t?.name ?? tid;
          } catch {
            map[tid] = tid;
          }
        }));
        setTournamentNames(map);
      } catch (e) {
        setError(e.message || 'Error al cargar invitaciones');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [listInvitations, getTournament]);

  const navigate = useNavigate();
  const { push } = useToast();

  async function handleAccept(id, tournamentId) {
    setSubmitting(id);
    setError('');
    try {
      await acceptInvitation(id);
      
      setInvites((prev) => prev.filter((i) => i.id !== id));
      push('Invitación aceptada', { type: 'success' });
      
      if (tournamentId) navigate(`/gambler/tournaments/${tournamentId}`);
    } catch (e) {
      setError(e.message || 'Error al aceptar invitación');
      push(e.message || 'Error al aceptar invitación', { type: 'error' });
    } finally {
      setSubmitting(null);
    }
  }

  async function handleReject(id) {
    setSubmitting(id);
    setError('');
    try {
      await rejectInvitation(id);
      
      setInvites((prev) => prev.filter((i) => i.id !== id));
      push('Invitación rechazada', { type: 'info' });
    } catch (e) {
      setError(e.message || 'Error al rechazar invitación');
      push(e.message || 'Error al rechazar invitación', { type: 'error' });
    } finally {
      setSubmitting(null);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Invitaciones</h2>
      <ErrorMessage message={error} />
      <p>
        <Link to="/gambler" style={{ padding: '0.3rem 0.5rem', background: '#f3f4f6', borderRadius: 4, textDecoration: 'none' }}>← Volver al inicio</Link>
      </p>
      {invites.length === 0 ? (
        <div style={{ padding: '1rem', background: '#fff', borderRadius: 6 }}>
          <p>No tenés invitaciones pendientes.</p>
        </div>
      ) : (
        <div style={{ padding: '1rem', background: '#fff', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '0.5rem' }}>ID</th>
                <th style={{ padding: '0.5rem' }}>Torneo</th>
                <th style={{ padding: '0.5rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #f6f6f6' }}>
                  <td style={{ padding: '0.5rem', verticalAlign: 'middle' }}>{inv.id}</td>
                  <td style={{ padding: '0.5rem', verticalAlign: 'middle' }}>
                    <Link to={`/gambler/tournaments/${inv.tournament}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                      {tournamentNames[inv.tournament] ?? inv.tournament}
                    </Link>
                  </td>
                  <td style={{ padding: '0.5rem', verticalAlign: 'middle' }}>
                    {inv.acceptedAt ? (
                      <span style={{ color: 'green' }}>Aceptada</span>
                    ) : inv.revokedAt ? (
                      <span style={{ color: '#888' }}>Rechazada</span>
                    ) : (
                      <>
                        <button onClick={() => handleAccept(inv.id, inv.tournament)} disabled={submitting === inv.id} style={{ padding: '0.4rem 0.6rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: 4 }}>
                          {submitting === inv.id ? 'Procesando…' : 'Aceptar'}
                        </button>
                        <button onClick={() => handleReject(inv.id)} disabled={submitting === inv.id} style={{ marginLeft: '0.5rem', padding: '0.4rem 0.6rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4 }}>
                          {submitting === inv.id ? 'Procesando…' : 'Rechazar'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
