import { Link } from 'react-router-dom';

export default function GamblerDashboard() {
  return (
    <div>
      <h1>Panel del Jugador</h1>
<<<<<<< HEAD
      <p>Desde aquí puedes acceder a tus torneos y puntajes.</p>
=======
      <p>Desde aquí podés acceder a tus torneos y puntajes.</p>
>>>>>>> main

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
