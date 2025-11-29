import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { useUsersApi } from '../../hooks/api/useUsersApi.js';

const ROLE_OPTIONS = ['ADMIN', 'MANAGER', 'GAMBLER'];

export default function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { getUser, createUser, updateUser } = useUsersApi();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('GAMBLER');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Cargar usuario si es edición
  useEffect(() => {
    if (!isEdit) return;

    async function loadUser() {
      setLoading(true);
      setError('');
      try {
        const user = await getUser(id);
        setEmail(user.email ?? '');
        setRole(user.role ?? 'GAMBLER');
      } catch (e) {
        setError(e.message || 'Error al cargar el usuario');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id, isEdit, getUser]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        email,
        role,
      };

      // Solo enviamos contraseña si el usuario escribió algo
      if (password.trim()) {
        payload.password = password.trim();
      }

      if (isEdit) {
        await updateUser(id, payload);
      } else {
        await createUser(payload);
      }

      navigate('/admin/users');
    } catch (e) {
      setError(e.message || 'Error al guardar el usuario');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h2>{isEdit ? 'Editar usuario' : 'Nuevo usuario'}</h2>

      <p>
        <Link to="/admin/users">← Volver al listado</Link>
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '400px',
          padding: '1rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
        }}
      >
        <ErrorMessage message={error} />

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            Rol
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            {isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            {...(isEdit ? {} : { required: true })}
          />
          {isEdit && (
            <small style={{ display: 'block', marginTop: '0.25rem' }}>
              Dejá vacío para mantener la contraseña actual.
            </small>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {submitting ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}
