import { useEffect, useMemo, useState } from 'react';
<<<<<<< HEAD
import { useLocation } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import Table from '../../components/ui/Table.jsx';
=======
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loading from '../../components/ui/Loading.jsx';
>>>>>>> main
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

<<<<<<< HEAD
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const editRequested = searchParams.get('edit') === 'true';

=======
>>>>>>> main
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

<<<<<<< HEAD
=======
  // Pronósticos de otros usuarios (solo en partidos pasados)
>>>>>>> main
  useEffect(() => {
    if (!matchIsPast || !match?.id) return;

    async function loadForecasts() {
      setLoadingForecasts(true);
      setForecastError('');
      try {
        const data = await listForecasts(match.id, match.tournamentId);
        setOtherForecasts(Array.isArray(data) ? data : data.items ?? []);
      } catch (e) {
<<<<<<< HEAD
        setForecastError(e.message || 'Error al cargar pronosticos');
=======
        setForecastError(e.message || 'Error al cargar pronósticos');
>>>>>>> main
      } finally {
        setLoadingForecasts(false);
      }
    }

    loadForecasts();
  }, [matchIsPast, match, listForecasts]);

<<<<<<< HEAD
=======
  // Reload helpers used after saving/deleting user's forecast
>>>>>>> main
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
<<<<<<< HEAD
      setForecastError(e.message || 'Error al cargar pronosticos');
=======
      setForecastError(e.message || 'Error al cargar pronósticos');
>>>>>>> main
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
<<<<<<< HEAD
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
=======
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
>>>>>>> main
        </section>
      )}

      {matchIsPast && (
<<<<<<< HEAD
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
=======
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
>>>>>>> main
                </tr>
              </thead>
              <tbody>
                {otherForecasts.map((f) => (
<<<<<<< HEAD
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
=======
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
>>>>>>> main
          )}
        </section>
      )}
    </div>
  );
}
