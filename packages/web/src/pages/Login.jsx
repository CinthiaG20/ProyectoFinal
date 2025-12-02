import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const result = await login({ email, password });
      const role = result.user.role;

      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'MANAGER') navigate('/manager');
      else navigate('/gambler');

    } catch (e) {
      setError(e.message || 'Error al iniciar sesion');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="layout-login-root">
      <div className="layout-login-grid">
        <section className="layout-login-panel-accent" aria-label="Informacion general">
          <div className="layout-login-badge">
            <span className="layout-login-badge-dot" />
            Plataforma de torneos y pronosticos
          </div>

          <h1 className="layout-login-title">Bienvenido a Pencas App</h1>
          <p className="layout-login-subtitle">
            Gestiona torneos, equipos y pronosticos en un entorno unificado para administradores,
            managers y jugadores.
          </p>

          <h3 style={{ margin: '0 0 0.4rem', fontSize: '0.92rem', fontWeight: 600 }}>
            Usuarios de prueba
          </h3>
          <p
            style={{
              margin: '0 0 0.75rem',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
            }}
          >
            Puedes usar estas cuentas para navegar por las distintas vistas de la aplicación.
          </p>
          <ul className="layout-login-list">
            <li>
              <span className="layout-login-list-label">Admin</span>
              <span>
                <strong>admin@example.com</strong> / admin
              </span>
            </li>
            <li>
              <span className="layout-login-list-label">Manager</span>
              <span>
                <strong>manager@example.com</strong> / manager
              </span>
            </li>
            <li>
              <span className="layout-login-list-label">Gambler</span>
              <span>
                <strong>gambler@example.com</strong> / gambler
              </span>
            </li>
          </ul>

          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="chip">
              <span className="chip-dot" />
              Pronosticos en vivo
            </span>
            <span className="chip">
              <span className="chip-dot" />
              Invitaciones a torneos
            </span>
            <span className="chip">
              <span className="chip-dot" />
              Tablas de posiciones
            </span>
          </div>
        </section>

        <section className="layout-login-panel" aria-label="Formulario de inicio de sesión">
          <header>
            <h2 className="layout-login-form-title">Iniciar sesion</h2>
            <p className="layout-login-form-subtitle">
              Accede con uno de los usuarios de prueba o con las credenciales de tu cuenta.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="field-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="login-password">
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                placeholder="••••••••"
              />
            </div>

            <ErrorMessage message={error} />

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {submitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <footer className="layout-login-footer">
            <span>
              ¿Solo quieres probar la app? Usa cualquiera de los usuarios de prueba de la columna
              izquierda.
            </span>
          </footer>
        </section>
      </div>
    </div>
  );
}
