import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import Table from '../../components/ui/Table.jsx';
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

  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const editRequested = searchParams.get('edit') === 'true';

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

  useEffect(() => {
    if (!matchIsPast || !match?.id) return;

    async function loadForecasts() {
      setLoadingForecasts(true);
      setForecastError('');
      try {
        const data = await listForecasts(match.id, match.tournamentId);
        setOtherForecasts(Array.isArray(data) ? data : data.items ?? []);
      } catch (e) {
        setForecastError(e.message || 'Error al cargar pronosticos');
      } finally {
        setLoadingForecasts(false);
      }
    }

    loadForecasts();
  }, [matchIsPast, match, listForecasts]);

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
      setForecastError(e.message || 'Error al cargar pronosticos');
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
      <div className="page-header">
        <div>
          <h2 className="page-title">{match.name}</h2>
          <p className="page-subtitle">
            {match.teamA?.name} vs {match.teamB?.name} · {match.date}
          </p>
        </div>
        {tournamentId && (
          <div className="page-actions">
            <Link
              to={`/gambler/tournaments/${tournamentId}/matches`}
              className="btn btn-ghost"
            >
              ← Volver a partidos del torneo
            </Link>
          </div>
        )}
      </div>

      <section className="app-card" style={{ marginBottom: '1.25rem' }}>
        <h3 className="page-subtitle" style={{ textTransform: 'uppercase', letterSpacing: '.08em' }}>
          Resultado real
        </h3>
        {match.result ? (
          <p style={{ fontSize: '1.1rem', marginTop: '0.4rem' }}>
            <strong>{match.teamA?.name}</strong> {match.result.goalsA} – {match.result.goalsB}{' '}
            <strong>{match.teamB?.name}</strong>
          </p>
        ) : (
          <p className="table-cell-muted" style={{ marginTop: '0.3rem' }}>
            Sin resultado cargado aun.
          </p>
        )}
      </section>

      {(!matchIsPast || (editRequested && !match?.result)) && (
        <section className="app-card">
          <ForecastForm
            match={match}
            onSaved={async () => {
              await reloadMatch();
              await reloadForecastsIfPast();
            }}
          />
        </section>
      )}

      {matchIsPast && (
        <section style={{ marginTop: '1.5rem' }}>
          <h3 className="page-title" style={{ fontSize: '0.98rem' }}>
            Pronosticos de otros jugadores
          </h3>
          <p className="page-subtitle" style={{ marginBottom: '0.75rem' }}>
            Compara tu pronostico con el del resto de participantes
          </p>

          <ErrorMessage message={forecastError} />

          {loadingForecasts ? (
            <div className="table-shell">
              <div className="table-empty">Cargando pronosticos…</div>
            </div>
          ) : otherForecasts.length === 0 ? (
            <div className="table-shell">
              <div className="table-empty">No hay pronosticos registrados.</div>
            </div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Pronostico</th>
                  <th>Puntos obtenidos</th>
                </tr>
              </thead>
              <tbody>
                {otherForecasts.map((f) => (
                  <tr key={f.id}>
                    <td>{f.userEmail ?? f.userId}</td>
                    <td style={{ textAlign: 'center' }}>
                      {f.goalsA} – {f.goalsB}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {typeof f.points === 'number' ? (
                        <span className="table-badge table-badge-positive">
                          {f.points} pts
                        </span>
                      ) : (
                        <span className="table-cell-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </section>
      )}
    </div>
  );
}
