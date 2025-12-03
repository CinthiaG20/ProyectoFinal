import { useEffect, useState } from 'react';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import { useToast } from '../../components/ui/ToastContext.jsx';
import { useForecastsApi } from '../../hooks/api/useForecastsApi.js';

export default function ForecastForm({ match, onSaved }) {
  const matchId = match?.id;
<<<<<<< HEAD
  const { getMyForecast, createOrUpdateForecast, deleteForecast } =
    useForecastsApi();
=======
  const { getMyForecast, createOrUpdateForecast, deleteForecast } = useForecastsApi();
>>>>>>> main

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
<<<<<<< HEAD
=======
      } catch (e) {
        // Si 404 o similar, puede no haber pronóstico: lo ignoramos
>>>>>>> main
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
<<<<<<< HEAD
      const saved = await createOrUpdateForecast(matchId, {
=======
      await createOrUpdateForecast(matchId, {
>>>>>>> main
        goalsA: Number(goalsA),
        goalsB: Number(goalsB),
      });
      push('Pronóstico guardado', { type: 'success' });
<<<<<<< HEAD
      if (onSaved) onSaved(saved);
=======
      if (onSaved) onSaved();
>>>>>>> main
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
<<<<<<< HEAD
      setError(e.message || 'Error al eliminar pronostico');
      push(e.message || 'Error al eliminar pronostico', { type: 'error' });
=======
      setError(e.message || 'Error al eliminar pronóstico');
      push(e.message || 'Error al eliminar pronóstico', { type: 'error' });
>>>>>>> main
    } finally {
      setSubmitting(false);
    }
  }

<<<<<<< HEAD
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
=======
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
>>>>>>> main
          </button>
        </div>
      </form>
    </div>
  );
}
