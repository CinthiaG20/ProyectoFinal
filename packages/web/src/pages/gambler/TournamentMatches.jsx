import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { useMatchesApi } from '../../hooks/api/useMatchesApi.js';
import { useTournamentsApi } from '../../hooks/api/useTournamentsApi.js';

function isPast(dateString) {
  if (!dateString) return false;
  const now = new Date();
  const d = new Date(dateString);
  return d < now;
}

export default function TournamentMatches() {
  const { id } = useParams();
  const { listMatchesByTournament } = useMatchesApi();
  const { getMyTournament, listMyMatches } = useTournamentsApi();

  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [t, m] = await Promise.all([
          getMyTournament(id),
          listMyMatches(id).catch(() => listMatchesByTournament(id)),
        ]);
        setTournament(t);
        const matchesList = Array.isArray(m) ? m : m?.items ?? [];
        setMatches(matchesList);
      } catch (e) {
        setError(e.message || 'Error al cargar partidos');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, listMatchesByTournament, listMyMatches, getMyTournament]);

  const futureMatches = useMemo(
    () => matches.filter((m) => !isPast(m.date)),
    [matches],
  );
  const pastMatches = useMemo(
    () => matches.filter((m) => isPast(m.date)),
    [matches],
  );

  if (loading) return <Loading />;

  if (!tournament) {
    return <ErrorMessage message={error || 'Torneo no encontrado'} />;
  }

  return (
    <div>
      <h2>Partidos – {tournament.name}</h2>
      <p>
        <Link to={`/gambler/tournaments/${tournament.id}`}>
          ← Volver al torneo
        </Link>
      </p>

      <ErrorMessage message={error} />

      <section style={{ marginBottom: '2rem' }}>
        <h3>Proximos partidos</h3>
        {futureMatches.length === 0 ? (
          <p>No hay partidos futuros</p>
        ) : (
          <ul>
            {futureMatches.map((m) => (
              <li key={m.id} style={{ marginBottom: '0.5rem' }}>
                <strong>{m.name}</strong> – {m.teamA?.name} vs{' '}
                {m.teamB?.name}{' '}
                <span>({m.date})</span>{' '}
                <Link to={`/gambler/matches/${m.id}`}>Ver / pronosticar</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Partidos jugados</h3>
        {pastMatches.length === 0 ? (
          <p>No hay partidos jugados aun</p>
        ) : (
          <ul>
            {pastMatches.map((m) => (
              <li key={m.id} style={{ marginBottom: '0.5rem' }}>
                <strong>{m.name}</strong> – {m.teamA?.name} vs{' '}
                {m.teamB?.name}{' '}
                <span>({m.date})</span>{' '}
                {m.result ? (
                  <span>
                    – Resultado: {m.result.goalsA} - {m.result.goalsB}
                  </span>
                ) : (
                  <span>– Sin resultado cargado</span>
                )}{' '}
                <Link to={`/gambler/matches/${m.id}`}>Ver detalle</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
