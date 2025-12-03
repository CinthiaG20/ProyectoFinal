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

<<<<<<< HEAD
=======
  const [team, setTeam] = useState(null);
>>>>>>> main
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
<<<<<<< HEAD
        const selected = teams.find((t) => t.id === id);
        if (selected) {
=======
        const selected = teams.find(t => t.id === id);
        if (selected) {
          setTeam(selected);
>>>>>>> main
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
<<<<<<< HEAD
      <div className="page-header">
        <div>
          <h2 className="page-title">
            {isEdit ? 'Editar equipo' : 'Nuevo equipo'}
          </h2>
          <p className="page-subtitle">Información básica del equipo</p>
        </div>
        <div className="page-actions">
          <Link to="/manager/teams" className="btn btn-ghost">
            ← Volver
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="app-card" style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label">Nombre</label>
            <input
              className="field-input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field-label">Descripción</label>
            <textarea
              className="field-input"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field-label">URL del logo</label>
            <input
              className="field-input"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Guardando…' : 'Guardar'}
            </button>
            <Link to="/manager/teams" className="btn btn-ghost">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
=======
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
>>>>>>> main
    </div>
  );
}
