import { backend } from '../client.js';

export async function apiListTeams() {
  return backend.get('/api/teams');
}

export async function apiCreateTeam(payload) {
  return backend.post('/api/teams', payload);
}

export async function apiUpdateTeam(id, payload) {
  return backend.put(`/api/teams/${id}`, payload);
}

export async function apiDeleteTeam(id) {
  return backend.delete(`/api/teams/${id}`);
}
