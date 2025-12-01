import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../../../components/ui/ErrorMessage.jsx';
import Loading from '../../../components/ui/Loading.jsx';
import { useTeamsApi } from '../../../hooks/api/useTeamsApi.js';

export default function TeamForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { listTeams, createTeam, updateTeam } = useTeamsApi();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    async function loadTeams() {
      try {
        const teams = await listTeams();
        const selected = teams.find(t => t.id === id);
        if (selected) {
          setTeam(selected);
          setName(selected.name);
          setDescription(selected.description);
          setLogo(selected.logo || '');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, [id, isEdit, listTeams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = { name, description, logo };

      if (isEdit) {
        await updateTeam(id, payload);
      } else {
        await createTeam(payload);
      }

      navigate('/manager/teams');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h2>{isEdit ? 'Editar equipo' : 'Nuevo equipo'}</h2>
      <p>
        <Link to="/manager/teams">← Volver</Link>
      </p>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <label>
          Nombre
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>

        <label>
          Descripción
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </label>

        <label>
          URL del logo
          <input value={logo} onChange={e => setLogo(e.target.value)} />
        </label>

        <button disabled={submitting}>
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}
