import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div>
<<<<<<< HEAD
      <div className="page-header">
        <div>
          <h1 className="page-title">Panel de administracion</h1>
          <p className="page-subtitle">
            Accedé rapidamente a las secciones de gestion para administradores.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to="/admin/users" className="btn btn-primary">
          Ver listado de usuarios
        </Link>
        <Link to="/admin/users/new" className="btn btn-ghost">
          Crear nuevo usuario
        </Link>
      </div>
=======
      <h1>Panel de Administración</h1>
      <p>Desde aquí se gestionan los usuarios del sistema.</p>

      <ul>
        <li>
          <Link to="/admin/users">Ver listado de usuarios</Link>
        </li>
        <li>
          <Link to="/admin/users/new">Crear nuevo usuario</Link>
        </li>
      </ul>
>>>>>>> main
    </div>
  );
}
