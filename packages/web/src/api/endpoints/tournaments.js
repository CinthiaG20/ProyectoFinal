import { backend } from '../client.js';

export async function apiListTournaments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/api/tournaments?${query}` : '/api/tournaments';
  return backend.get(url);
}

export async function apiGetTournament(id) {
  return backend.get(`/api/tournaments/${id}`);
}

export async function apiCreateTournament(payload) {
  return backend.post('/api/tournaments', payload);
}

export async function apiUpdateTournament(id, payload) {
  return backend.put(`/api/tournaments/${id}`, payload);
}

export async function apiDeleteTournament(id) {
  return backend.delete(`/api/tournaments/${id}`);
}

export async function apiInviteUserToTournament(tournamentId, payload) {
  return backend.post(`/api/tournaments/${tournamentId}/invites`, payload);
}

export async function apiListMyTournaments() {
  return backend.get('/api/me/tournaments');
}

export async function apiGetMyTournament(id) {
  return backend.get(`/api/me/tournaments/${id}`);
}

export async function apiListMyMatches(tournamentId) {
  return backend.get(`/api/me/tournaments/${tournamentId}/matches`);
}
