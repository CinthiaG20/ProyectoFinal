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
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

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
            </small>
          )}
        </div>

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
      </form>
    </div>
  );
}
