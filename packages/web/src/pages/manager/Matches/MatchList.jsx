import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../../components/ui/ErrorMessage.jsx';
import Loading from '../../../components/ui/Loading.jsx';
import Table from '../../../components/ui/Table.jsx';
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
      <div className="page-header">
        <div>
          <h2 className="page-title">Partidos</h2>
          <p className="page-subtitle">
            Administrar los partidos y resultados de los diferentes torneos
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/manager/matches/new')}
          >
            Nuevo partido
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '0.85rem' }}>
        <label className="field-label" htmlFor="matches-tournament-select">
          Torneo
        </label>
        <select
          id="matches-tournament-select"
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="field-input"
          style={{ maxWidth: 260 }}
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <ErrorMessage message={error} />

      {matches.length === 0 ? (
        <div className="table-shell">
          <div className="table-empty">No hay partidos para el torneo seleccionado</div>
        </div>
      ) : (
        <Table>
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
            {matches.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>
                  {m.teamA?.name} vs {m.teamB?.name}
                </td>
                <td className="table-cell-muted">{m.date}</td>
                <td>
                  {m.result ? (
                    <span className="table-badge table-badge-positive">
                      {m.result.goalsA} – {m.result.goalsB}
                    </span>
                  ) : (
                    <span className="table-badge table-badge-danger">Pendiente</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <Link
                      to={`/manager/matches/${m.id}`}
                      className="btn btn-ghost"
                    >
                      Editar
                    </Link>
                    <Link
                      to={`/manager/matches/${m.id}/result`}
                      className="btn btn-ghost"
                    >
                      Cargar resultado
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
