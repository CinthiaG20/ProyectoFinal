import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#1f2933',
        color: '#fff',
      }}
    >
      <div>
        <Link to="/" style={{ fontWeight: 600 }}>
          Pencas App
        </Link>
      </div>
      {user && (
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
          {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
            <Link to="/manager">Manager</Link>
          )}
          <Link to="/gambler">Mis Torneos</Link>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            {user.email} ({user.role})
          </span>
          <button type="button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </nav>
      )}
    </header>
  );
}
