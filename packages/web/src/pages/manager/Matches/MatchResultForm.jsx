import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../../../components/ui/ErrorMessage.jsx';
import Loading from '../../../components/ui/Loading.jsx';
import { useMatchesApi } from '../../../hooks/api/useMatchesApi.js';

export default function MatchResultForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getMatch, setMatchResult } = useMatchesApi();

  const [match, setMatch] = useState(null);
  const [goalsA, setGoalsA] = useState('');
  const [goalsB, setGoalsB] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const m = await getMatch(id);
        setMatch(m);

        if (m.result) {
          setGoalsA(m.result.goalsA);
          setGoalsB(m.result.goalsB);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, getMatch]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await setMatchResult(id, {
        goalsA: Number(goalsA),
        goalsB: Number(goalsB),
      });
      navigate('/manager/matches');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  if (!match) return <ErrorMessage message="Partido no encontrado" />;

  return (
    <div>
<<<<<<< HEAD
      <div className="page-header">
        <div>
          <h2 className="page-title">Cargar resultado</h2>
          <p className="page-subtitle">
            {match.teamA?.name} vs {match.teamB?.name} · {match.date}
          </p>
        </div>
        <div className="page-actions">
          <Link to="/manager/matches" className="btn btn-ghost">
            ← Volver
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} style={{ maxWidth: 320 }}>
        <div className="field">
          <label className="field-label" htmlFor="match-result-a">
            Goles {match.teamA?.name}
          </label>
          <input
            id="match-result-a"
            type="number"
            required
            value={goalsA}
            onChange={(e) => setGoalsA(e.target.value)}
            className="field-input"
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="match-result-b">
            Goles {match.teamB?.name}
          </label>
          <input
            id="match-result-b"
            type="number"
            required
            value={goalsB}
            onChange={(e) => setGoalsB(e.target.value)}
            className="field-input"
          />
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? 'Guardando…' : 'Guardar resultado'}
          </button>
          <Link to="/manager/matches" className="btn btn-ghost">
            Cancelar
          </Link>
        </div>
=======
      <h2>Cargar resultado: {match.name}</h2>

      <p>
        <Link to="/manager/matches">← Volver</Link>
      </p>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} style={{ maxWidth: '300px' }}>
        <p>
          {match.teamA?.name} vs {match.teamB?.name}
        </p>

        <label>
          Goles {match.teamA?.name}
          <input
            type="number"
            required
            value={goalsA}
            onChange={e => setGoalsA(e.target.value)}
          />
        </label>

        <label>
          Goles {match.teamB?.name}
          <input
            type="number"
            required
            value={goalsB}
            onChange={e => setGoalsB(e.target.value)}
          />
        </label>

        <button disabled={submitting}>
          {submitting ? 'Guardando…' : 'Guardar resultado'}
        </button>
>>>>>>> main
      </form>
    </div>
  );
}
