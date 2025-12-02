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

<<<<<<< HEAD
=======
  // Cargar usuario si es edición
>>>>>>> main
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

<<<<<<< HEAD
=======
      // Solo enviamos contraseña si el usuario escribió algo
>>>>>>> main
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
<<<<<<< HEAD
      <div className="page-header">
        <div>
          <h2 className="page-title">
            {isEdit ? 'Editar usuario' : 'Nuevo usuario'}
          </h2>
          <p className="page-subtitle">
            Completa los datos basicos y asigna el rol correspondiente
          </p>
        </div>
        <div className="page-actions">
          <Link to="/admin/users" className="btn btn-ghost">
            ← Volver al listado
          </Link>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 420 }}
      >
        <ErrorMessage message={error} />

        <div className="field">
          <label className="field-label" htmlFor="user-email">
            Email
          </label>
          <input
            id="user-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field-input"
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="user-role">
            Rol
          </label>
          <select
            id="user-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="field-input"
=======
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
>>>>>>> main
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

<<<<<<< HEAD
        <div className="field">
          <label className="field-label" htmlFor="user-password">
            {isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'}
          </label>
          <input
            id="user-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field-input"
            autoComplete={isEdit ? 'new-password' : 'current-password'}
            {...(isEdit ? {} : { required: true })}
          />
          {isEdit && (
            <small style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Deja vacio para mantener la contraseña actual
=======
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
>>>>>>> main
            </small>
          )}
        </div>

<<<<<<< HEAD
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </button>
          <Link to="/admin/users" className="btn btn-ghost">
            Cancelar
          </Link>
        </div>
=======
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
>>>>>>> main
      </form>
    </div>
  );
}
