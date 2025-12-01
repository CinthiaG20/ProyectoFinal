import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../../../components/ui/ErrorMessage.jsx';
import Loading from '../../../components/ui/Loading.jsx';
import { useTournamentsApi } from '../../../hooks/api/useTournamentsApi.js';

export default function TournamentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { getTournament, createTournament, updateTournament } = useTournamentsApi();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      try {
        const data = await getTournament(id);
        setName(data.name);
        setDescription(data.description ?? '');
        setStartDate(data.startDate);
        setEndDate(data.endDate);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, isEdit, getTournament]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = { name, description, startDate, endDate };

      if (isEdit) {
        await updateTournament(id, payload);
      } else {
        await createTournament(payload);
      }

      navigate('/manager/tournaments');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h2>{isEdit ? 'Editar torneo' : 'Nuevo torneo'}</h2>

      <p>
        <Link to="/manager/tournaments">← Volver</Link>
      </p>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div style={fieldStyle}>
          <label>Nombre</label>
          <input value={name} required onChange={e => setName(e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Fecha inicio</label>
          <input
            type="date"
            required
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label>Fecha fin</label>
          <input
            type="date"
            required
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        <button disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}

const fieldStyle = { marginBottom: '1rem', display: 'flex', flexDirection: 'column' };
