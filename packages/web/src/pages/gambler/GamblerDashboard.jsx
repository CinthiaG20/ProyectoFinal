import { Link } from 'react-router-dom';

export default function GamblerDashboard() {
  return (
    <div>
      <h1>Panel del Jugador</h1>
      <p>Desde aquí podés acceder a tus torneos y puntajes.</p>

      <ul>
        <li>
          <Link to="/gambler/tournaments">Mis torneos</Link>
        </li>
        <li>
          <Link to="/gambler/invitations">Mis invitaciones</Link>
        </li>
        <li>
          <Link to="/gambler/forecasts">Mis pronósticos</Link>
        </li>
      </ul>
    </div>
  );
}
