import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../../components/ui/ErrorMessage.jsx';
import Loading from '../../../components/ui/Loading.jsx';
import { useTournamentsApi } from '../../../hooks/api/useTournamentsApi.js';
import { useUsersApi } from '../../../hooks/api/useUsersApi.js';

export default function TournamentInvites() {
  const { id } = useParams();

  const { inviteUserToTournament, getTournament } = useTournamentsApi();
  const { listUsers } = useUsersApi();

  const [users, setUsers] = useState([]);
  const [invited, setInvited] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [usersData, tournament] = await Promise.all([
          listUsers(),
          getTournament(id),
        ]);

        setUsers(usersData);
        setInvited(tournament.invitedUsers ?? []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, listUsers, getTournament]);

  async function handleInvite(userId) {
    setSubmitting(userId);
    setError('');

    try {
      const result = await inviteUserToTournament(id, { userId });
      setInvited(result.invitedUsers);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(null);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Invitar usuarios</h2>
      <p>
        <Link to="/manager/tournaments">← Volver</Link>
      </p>

      <ErrorMessage message={error} />

      <table style={{ width: '100%', background: '#fff' }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Invitado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => {
            const already = invited.includes(u.id);
            return (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{already ? 'Sí' : 'No'}</td>
                <td>
                  {!already && (
                    <button
                      onClick={() => handleInvite(u.id)}
                      disabled={submitting === u.id}
                    >
                      {submitting === u.id ? 'Invitando…' : 'Invitar'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
