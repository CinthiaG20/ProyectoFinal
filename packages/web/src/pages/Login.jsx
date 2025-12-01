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
      setError(e.message || 'Error al iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
        padding: '1rem'
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        
        {/* CUADRO DE CREDENCIALES */}
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            fontSize: '0.9rem'
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Usuarios de prueba</h3>
          <ul style={{ margin: 0, paddingLeft: '1rem' }}>
            <li><b>Admin:</b> admin@example.com / admin</li>
            <li><b>Manager:</b> manager@example.com / manager</li>
            <li><b>Gambler:</b> gambler@example.com / gambler</li>
          </ul>
        </div>

        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            padding: '2rem',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h1 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Ingresar</h1>

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Contraseña
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </label>

          <ErrorMessage message={error} />

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
