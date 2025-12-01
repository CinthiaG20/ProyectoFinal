import { backend } from '../client.js';

export async function apiListMatchesByTournament(tournamentId) {
  return backend.get(`/api/tournaments/${tournamentId}/matches`);
}

export async function apiGetMatch(id) {
  return backend.get(`/api/matches/${id}`);
}

export async function apiCreateMatch(payload) {
  return backend.post('/api/matches', payload);
}

export async function apiUpdateMatch(id, payload) {
  return backend.put(`/api/matches/${id}`, payload);
}

export async function apiSetMatchResult(id, payload) {
  return backend.post(`/api/matches/${id}/result`, payload);
}
