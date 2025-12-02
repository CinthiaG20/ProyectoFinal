import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import Table from '../../components/ui/Table.jsx';
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
      '¿Estas seguro de que quieres eliminar este usuario?',
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
      <div className="page-header">
        <div>
          <h2 className="page-title">Usuarios</h2>
          <p className="page-subtitle">
            Gestiona las cuentas que pueden acceder al sistema y sus roles.
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/admin/users/new')}
          >
            Nuevo usuario
          </button>
        </div>
      </div>

      <ErrorMessage message={error} />

      {users.length === 0 ? (
        <div className="table-shell">
          <div className="table-empty">No hay usuarios registrados todavia.</div>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="table-cell-muted">{user.id}</td>
                <td>{user.email}</td>
                <td>
                  <span className="table-badge">
                    {user.role}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <Link to={`/admin/users/${user.id}`} className="btn btn-ghost">
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="btn btn-ghost btn-ghost-danger"
                    >
                      {deletingId === user.id ? 'Eliminando…' : 'Eliminar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
