import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div>
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
    </div>
  );
}
