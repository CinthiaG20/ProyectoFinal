import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>404 - Página no encontrada</h1>
      <p>
        <Link to="/">Volver al inicio</Link>
      </p>
    </div>
  );
}
