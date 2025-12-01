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
      </form>
    </div>
  );
}
