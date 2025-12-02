import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import Table from '../../components/ui/Table.jsx';
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
      setError(e.message || 'Error al aceptar invitacion');
      push(e.message || 'Error al aceptar invitacion', { type: 'error' });
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
      push('Invitacion rechazada', { type: 'info' });
    } catch (e) {
      setError(e.message || 'Error al rechazar invitacion');
      push(e.message || 'Error al rechazar invitacion', { type: 'error' });
    } finally {
      setSubmitting(null);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Invitaciones</h2>
          <p className="page-subtitle">
            Acepta o rechaza invitaciones para sumarte a nuevos torneos
          </p>
        </div>
        <div className="page-actions">
          <Link to="/gambler" className="btn btn-ghost">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} />

      {invites.length === 0 ? (
        <div className="table-shell">
          <div className="table-empty">No tienes invitaciones pendientes</div>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Torneo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invites.map((inv) => {
              const tournamentLabel = tournamentNames[inv.tournament] ?? inv.tournament;
              const accepted = Boolean(inv.acceptedAt);
              const revoked = Boolean(inv.revokedAt);

              return (
                <tr key={inv.id}>
                  <td className="table-cell-muted">{inv.id}</td>
                  <td>
                    <Link to={`/gambler/tournaments/${inv.tournament}`}>
                      {tournamentLabel}
                    </Link>
                  </td>
                  <td>
                    {accepted ? (
                      <span className="table-badge table-badge-positive">Aceptada</span>
                    ) : revoked ? (
                      <span className="table-badge table-badge-danger">Rechazada</span>
                    ) : (
                      <span className="table-badge">Pendiente</span>
                    )}
                  </td>
                  <td>
                    {!accepted && !revoked && (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleAccept(inv.id, inv.tournament)}
                          disabled={submitting === inv.id}
                          className="btn btn-primary"
                        >
                          {submitting === inv.id ? 'Procesando…' : 'Aceptar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(inv.id)}
                          disabled={submitting === inv.id}
                          className="btn btn-ghost btn-ghost-danger"
                        >
                          {submitting === inv.id ? 'Procesando…' : 'Rechazar'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
