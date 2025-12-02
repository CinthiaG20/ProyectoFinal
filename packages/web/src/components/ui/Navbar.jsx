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
    <header className="navbar-root">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <Link to="/" aria-label="Ir al inicio">
            <span className="navbar-logo">P</span>
          </Link>
          <div>
            <div className="navbar-title">Pencas App</div>
            <div className="navbar-subtitle">Administra torneos y pronósticos</div>
          </div>
          <Link to="/gambler" className="navbar-home-link">
            ← Ir a mis torneos
          </Link>
        </div>

        {user && (
          <nav className="navbar-links" aria-label="Navegación principal">
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="navbar-link">
                Admin
              </Link>
            )}

            {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
              <Link to="/manager" className="navbar-link">
                Manager
              </Link>
            )}

            <Link to="/gambler" className="navbar-link">
              Mis torneos
            </Link>

            <div className="navbar-user">
              <span className="navbar-user-pill">
                <span>{user.email}</span>
                <span className="navbar-user-role">{user.role}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-ghost btn-ghost-danger"
              >
                Cerrar sesion
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
