import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { useUsersApi } from '../../hooks/api/useUsersApi.js';

export default function UserList() {
  const { listUsers, deleteUser } = useUsersApi();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function fetchUsers() {
    setLoading(true);
    setError('');
    try {
      const data = await listUsers();
      setUsers(Array.isArray(data) ? data : data.items ?? []);
    } catch (e) {
      setError(e.message || 'Error al obtener usuarios');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDelete(id) {
    const confirm = window.confirm(
      '¿Estás seguro de que querés eliminar este usuario?',
    );
    if (!confirm) return;

    setDeletingId(id);
    setError('');
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      setError(e.message || 'Error al eliminar usuario');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Usuarios</h2>

      <div style={{ marginBottom: '1rem' }}>
        <button type="button" onClick={() => navigate('/admin/users/new')}>
          Nuevo usuario
        </button>
      </div>

      <ErrorMessage message={error} />

      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Rol</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={tdStyle}>{user.id}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.role}</td>
                <td style={tdStyle}>
                  <Link to={`/admin/users/${user.id}`}>Editar</Link>{' '}
                  <button
                    type="button"
                    onClick={() => handleDelete(user.id)}
                    disabled={deletingId === user.id}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    {deletingId === user.id ? 'Eliminando...' : 'Eliminar'}
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

const thStyle = {
  borderBottom: '1px solid #ddd',
  padding: '0.5rem',
  textAlign: 'left',
};

const tdStyle = {
  borderBottom: '1px solid #eee',
  padding: '0.5rem',
};
