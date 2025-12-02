import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../../../components/ui/ErrorMessage.jsx';
import Loading from '../../../components/ui/Loading.jsx';
import { useMatchesApi } from '../../../hooks/api/useMatchesApi.js';
import { useTeamsApi } from '../../../hooks/api/useTeamsApi.js';
import { useTournamentsApi } from '../../../hooks/api/useTournamentsApi.js';

export default function MatchForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { getMatch, createMatch, updateMatch } = useMatchesApi();
  const { listTeams } = useTeamsApi();
  const { listTournaments } = useTournamentsApi();

  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  const [name, setName] = useState('');
  const [tournamentId, setTournamentId] = useState('');
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [date, setDate] = useState('');

  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [teamsRes, tournamentsRes] = await Promise.all([
          listTeams(),
          listTournaments(),
        ]);

        setTeams(teamsRes);
        setTournaments(tournamentsRes);

        if (isEdit) {
          const match = await getMatch(id);
          setName(match.name);
          setTournamentId(match.tournamentId);
          setTeamA(match.teamA?.id ?? '');
          setTeamB(match.teamB?.id ?? '');
          setDate(match.date);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, isEdit, listTeams, listTournaments, getMatch]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name,
        tournamentId,
        teamA,
        teamB,
        date,
      };

      if (isEdit) await updateMatch(id, payload);
      else await createMatch(payload);

      navigate('/manager/matches');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
<<<<<<< HEAD
      <div className="page-header">
        <div>
          <h2 className="page-title">
            {isEdit ? 'Editar partido' : 'Nuevo partido'}
          </h2>
          <p className="page-subtitle">
            Define los equipos, torneo y fecha para este partido
          </p>
        </div>
        <div className="page-actions">
          <Link to="/manager/matches" className="btn btn-ghost">
            ← Volver
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <div className="field">
          <label className="field-label" htmlFor="match-name">
            Nombre
          </label>
          <input
            id="match-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-input"
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="match-tournament">
            Torneo
          </label>
          <select
            id="match-tournament"
            required
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            className="field-input"
          >
            <option value="">Seleccionar</option>
            {tournaments.map((t) => (
=======
      <h2>{isEdit ? 'Editar partido' : 'Nuevo partido'}</h2>
      <p>
        <Link to="/manager/matches">← Volver</Link>
      </p>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <label>
          Nombre
          <input required value={name} onChange={e => setName(e.target.value)} />
        </label>

        <label>
          Torneo
          <select
            required
            value={tournamentId}
            onChange={e => setTournamentId(e.target.value)}
          >
            <option value="">Seleccionar</option>
            {tournaments.map(t => (
>>>>>>> main
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
<<<<<<< HEAD
        </div>

        <div className="field">
          <label className="field-label" htmlFor="match-team-a">
            Equipo A
          </label>
          <select
            id="match-team-a"
            required
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            className="field-input"
          >
            <option value="">Seleccionar</option>
            {teams.map((t) => (
=======
        </label>

        <label>
          Equipo A
          <select
            required
            value={teamA}
            onChange={e => setTeamA(e.target.value)}
          >
            <option value="">Seleccionar</option>
            {teams.map(t => (
>>>>>>> main
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
<<<<<<< HEAD
        </div>

        <div className="field">
          <label className="field-label" htmlFor="match-team-b">
            Equipo B
          </label>
          <select
            id="match-team-b"
            required
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            className="field-input"
          >
            <option value="">Seleccionar</option>
            {teams.map((t) => (
=======
        </label>

        <label>
          Equipo B
          <select
            required
            value={teamB}
            onChange={e => setTeamB(e.target.value)}
          >
            <option value="">Seleccionar</option>
            {teams.map(t => (
>>>>>>> main
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
<<<<<<< HEAD
        </div>

        <div className="field">
          <label className="field-label" htmlFor="match-date">
            Fecha y hora
          </label>
          <input
            id="match-date"
            type="datetime-local"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="field-input"
          />
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? 'Guardando…' : 'Guardar'}
          </button>
          <Link to="/manager/matches" className="btn btn-ghost">
            Cancelar
          </Link>
        </div>
=======
        </label>

        <label>
          Fecha y hora
          <input
            type="datetime-local"
            required
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>

        <button disabled={submitting}>
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
>>>>>>> main
      </form>
    </div>
  );
}
