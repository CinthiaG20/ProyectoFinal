import { useEffect, useState } from 'react';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import { useForecastsApi } from '../../hooks/api/useForecastsApi.js';

export default function ForecastForm({ match, onSaved }) {
  const matchId = match?.id;
  const { getMyForecast, createOrUpdateForecast, deleteForecast } = useForecastsApi();

  const [goalsA, setGoalsA] = useState('');
  const [goalsB, setGoalsB] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      } catch (e) {
        // Si 404 o similar, puede no haber pronóstico: lo ignoramos
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
      await createOrUpdateForecast(matchId, {
        goalsA: Number(goalsA),
        goalsB: Number(goalsB),
      });
      if (onSaved) onSaved();
    } catch (e) {
      setError(e.message || 'Error al guardar pronóstico');
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
        if (onSaved) onSaved();
      }
    } catch (e) {
      setError(e.message || 'Error al eliminar pronóstico');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Cargando tu pronóstico...</p>;

  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '1rem',
        borderRadius: '6px',
        marginTop: '1rem',
        background: '#fff',
        maxWidth: '300px',
      }}
    >
      <h4>Tu pronóstico</h4>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Goles {match.teamA?.name}
            <input
              type="number"
              required
              value={goalsA}
              onChange={(e) => setGoalsA(e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Goles {match.teamB?.name}
            <input
              type="number"
              required
              value={goalsB}
              onChange={(e) => setGoalsB(e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar pronóstico'}
          </button>
          <button type="button" onClick={handleDelete} disabled={submitting || (!goalsA && !goalsB)} style={{ background: '#e11d48', color: '#fff' }}>
            {submitting ? 'Procesando...' : 'Eliminar'}
          </button>
        </div>
      </form>
    </div>
  );
}
