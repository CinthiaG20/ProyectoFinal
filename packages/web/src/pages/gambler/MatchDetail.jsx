import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { useForecastsApi } from '../../hooks/api/useForecastsApi.js';
import { useMatchesApi } from '../../hooks/api/useMatchesApi.js';
import ForecastForm from './ForecastForm.jsx';

function isPast(dateString) {
  if (!dateString) return false;
  const now = new Date();
  const d = new Date(dateString);
  return d < now;
}

export default function MatchDetail() {
  const { id } = useParams();
  const { getMatch } = useMatchesApi();
  const { listForecasts } = useForecastsApi();

  const [match, setMatch] = useState(null);
  const [tournamentId, setTournamentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [otherForecasts, setOtherForecasts] = useState([]);
  const [loadingForecasts, setLoadingForecasts] = useState(false);
  const [forecastError, setForecastError] = useState('');

  const matchIsPast = useMemo(
    () => (match ? isPast(match.date) : false),
    [match],
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const m = await getMatch(id);
        setMatch(m);
        setTournamentId(m.tournamentId ?? null);
      } catch (e) {
        setError(e.message || 'Error al cargar partido');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, getMatch]);

  // Pronósticos de otros usuarios (solo en partidos pasados)
  useEffect(() => {
    if (!matchIsPast || !match?.id) return;

    async function loadForecasts() {
      setLoadingForecasts(true);
      setForecastError('');
      try {
        const data = await listForecasts(match.id, match.tournamentId);
        setOtherForecasts(Array.isArray(data) ? data : data.items ?? []);
      } catch (e) {
        setForecastError(e.message || 'Error al cargar pronósticos');
      } finally {
        setLoadingForecasts(false);
      }
    }

    loadForecasts();
  }, [matchIsPast, match, listForecasts]);

  // Reload helpers used after saving/deleting user's forecast
  async function reloadMatch() {
    try {
      const m = await getMatch(id);
      setMatch(m);
      setTournamentId(m.tournamentId ?? null);
    } catch (e) {
      setError(e.message || 'Error al recargar partido');
    }
  }

  async function reloadForecastsIfPast() {
    if (!match?.id || !isPast(match.date)) return;
    setLoadingForecasts(true);
    setForecastError('');
    try {
      const data = await listForecasts(match.id, match.tournamentId);
      setOtherForecasts(Array.isArray(data) ? data : data.items ?? []);
    } catch (e) {
      setForecastError(e.message || 'Error al cargar pronósticos');
    } finally {
      setLoadingForecasts(false);
    }
  }

  if (loading) return <Loading />;

  if (!match) {
    return <ErrorMessage message={error || 'Partido no encontrado'} />;
  }

  return (
    <div>
      <h2>{match.name}</h2>

      {tournamentId && (
        <p>
          <Link to={`/gambler/tournaments/${tournamentId}/matches`}>
            ← Volver a partidos del torneo
          </Link>
        </p>
      )}

      <p>
        {match.teamA?.name} vs {match.teamB?.name}
      </p>
      <p>Fecha: {match.date}</p>

      <section style={{ marginTop: '1rem' }}>
        <h3>Resultado real</h3>
        {match.result ? (
          <p>
            {match.result.goalsA} - {match.result.goalsB}
          </p>
        ) : (
          <p>Sin resultado cargado aún.</p>
        )}
      </section>

      {!matchIsPast && (
        <section>
          <ForecastForm match={match} onSaved={() => reloadMatch()} />
        </section>
      )}

      {matchIsPast && (
        <section style={{ marginTop: '2rem' }}>
          <h3>Pronósticos de otros jugadores</h3>
          <ErrorMessage message={forecastError} />
          {loadingForecasts ? (
            <p>Cargando pronósticos...</p>
          ) : otherForecasts.length === 0 ? (
            <p>No hay pronósticos registrados.</p>
          ) : (
            <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'left', width: '60%' }}>Usuario</th>
                  <th style={{ padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'center', width: '25%' }}>Pronóstico</th>
                  <th style={{ padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'right', width: '15%' }}>Puntos obtenidos</th>
                </tr>
              </thead>
              <tbody>
                {otherForecasts.map((f) => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #f6f6f6' }}>
                    <td style={{ padding: '0.5rem', verticalAlign: 'middle', textAlign: 'left' }}>{f.userEmail ?? f.userId}</td>
                    <td style={{ padding: '0.5rem', verticalAlign: 'middle', textAlign: 'center' }}>
                      {f.goalsA} - {f.goalsB}
                    </td>
                    <td style={{ padding: '0.5rem', verticalAlign: 'middle', textAlign: 'right' }}>{f.points ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}
