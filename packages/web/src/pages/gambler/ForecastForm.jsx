import { useEffect, useState } from 'react';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import { useToast } from '../../components/ui/ToastContext.jsx';
import { useForecastsApi } from '../../hooks/api/useForecastsApi.js';

export default function ForecastForm({ match, onSaved }) {
  const matchId = match?.id;
  const { getMyForecast, createOrUpdateForecast, deleteForecast } =
    useForecastsApi();

  const [goalsA, setGoalsA] = useState('');
  const [goalsB, setGoalsB] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { push } = useToast();

  // Cargar pronóstico propio si existe
  useEffect(() => {
    async function load() {
      if (!matchId) return;
      setLoading(true);
      setError('');
      try {
        const data = await getMyForecast(matchId);
        if (data) {
          setGoalsA(data.goalsA?.toString() ?? '');
          setGoalsB(data.goalsB?.toString() ?? '');
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [matchId, getMyForecast]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const saved = await createOrUpdateForecast(matchId, {
        goalsA: Number(goalsA),
        goalsB: Number(goalsB),
      });
      push('Pronóstico guardado', { type: 'success' });
      if (onSaved) onSaved(saved);
    } catch (e) {
      setError(e.message || 'Error al guardar pronóstico');
      push(e.message || 'Error al guardar pronóstico', { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!matchId) return;
    setSubmitting(true);
    setError('');
    try {
      const data = await getMyForecast(matchId);
      const id = data?.id;
      if (id) {
        await deleteForecast(id);
        setGoalsA('');
        setGoalsB('');
        push('Pronóstico eliminado', { type: 'info' });
        if (onSaved) onSaved();
      }
    } catch (e) {
      setError(e.message || 'Error al eliminar pronostico');
      push(e.message || 'Error al eliminar pronostico', { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return <p className="table-cell-muted">Cargando tu pronostico…</p>;

  return (
    <div>
      <h4
        className="page-title"
        style={{ fontSize: '0.98rem', marginBottom: '0.6rem' }}
      >
        Tu pronóstico
      </h4>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit} style={{ maxWidth: 340 }}>
        <div className="field">
          <label className="field-label" htmlFor="forecast-goals-a">
            Goles {match.teamA?.name}
          </label>
          <input
            id="forecast-goals-a"
            type="number"
            required
            value={goalsA}
            onChange={(e) => setGoalsA(e.target.value)}
            className="field-input"
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="forecast-goals-b">
            Goles {match.teamB?.name}
          </label>
          <input
            id="forecast-goals-b"
            type="number"
            required
            value={goalsB}
            onChange={(e) => setGoalsB(e.target.value)}
            className="field-input"
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? 'Guardando…' : 'Guardar pronóstico'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting || (!goalsA && !goalsB)}
            className="btn btn-ghost btn-ghost-danger"
          >
            {submitting ? 'Procesando…' : 'Eliminar'}
          </button>
        </div>
      </form>
    </div>
  );
}
