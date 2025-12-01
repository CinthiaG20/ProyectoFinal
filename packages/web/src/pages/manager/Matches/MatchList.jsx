import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../../components/ui/ErrorMessage.jsx';
import Loading from '../../../components/ui/Loading.jsx';
import { useMatchesApi } from '../../../hooks/api/useMatchesApi.js';
import { useTournamentsApi } from '../../../hooks/api/useTournamentsApi.js';

export default function MatchList() {
  const navigate = useNavigate();
  const { listMatchesByTournament } = useMatchesApi();
  const { listTournaments } = useTournamentsApi();

  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const t = await listTournaments();
        setTournaments(t);

        if (t.length > 0) {
          setSelectedTournament(t[0].id);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [listTournaments]);

  useEffect(() => {
    if (!selectedTournament) return;

    async function loadMatches() {
      setMatches([]);
      setLoading(true);
      setError('');

      try {
        const data = await listMatchesByTournament(selectedTournament);
        setMatches(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [selectedTournament, listMatchesByTournament]);

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Partidos</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Torneo:{' '}
          <select
            value={selectedTournament}
            onChange={e => setSelectedTournament(e.target.value)}
          >
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <button
          style={{ marginLeft: '1rem' }}
          onClick={() => navigate('/manager/matches/new')}
        >
          Nuevo partido
        </button>
      </div>

      <ErrorMessage message={error} />

      <table style={{ width: '100%', background: '#fff' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Equipos</th>
            <th>Fecha</th>
            <th>Resultado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {matches.map(m => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>
                {m.teamA?.name} vs {m.teamB?.name}
              </td>
              <td>{m.date}</td>
              <td>
                {m.result
                  ? `${m.result.goalsA} - ${m.result.goalsB}`
                  : 'Pendiente'}
              </td>
              <td>
                <Link to={`/manager/matches/${m.id}`}>Editar</Link>{' '}
                |{' '}
                <Link to={`/manager/matches/${m.id}/result`}>
                  Cargar resultado
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
