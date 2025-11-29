import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { useTournamentsApi } from '../../hooks/api/useTournamentsApi.js';

export default function TournamentDetail() {
  const { id } = useParams();
  const { getMyTournament } = useTournamentsApi();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getMyTournament(id);
        setTournament(data);
      } catch (e) {
        setError(e.message || 'Error al cargar torneo');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, getTournament]);

  if (loading) return <Loading />;

  if (!tournament) {
    return <ErrorMessage message={error || 'Torneo no encontrado'} />;
  }

  return (
    <div>
      <h2>{tournament.name}</h2>
      <p>{tournament.description}</p>
      <p>
        <strong>Fechas:</strong> {tournament.startDate} – {tournament.endDate}
      </p>

      <p>
        <Link to="/gambler/tournaments">← Volver a mis torneos</Link>
      </p>

      <ul>
        <li>
          <Link to={`/gambler/tournaments/${tournament.id}/matches`}>
            Ver partidos
          </Link>
        </li>
        <li>
          <Link to={`/gambler/tournaments/${tournament.id}/leaderboard`}>
            Ver tabla de posiciones
          </Link>
        </li>
      </ul>
    </div>
  );
}
