import { backend } from '../client.js';

// The backend exposes gambles endpoints under /me for gamblers.
// Map frontend forecast operations to those routes.

export async function apiCreateOrUpdateForecast(matchId, payload) {
  // Backend expects { match, homeScore, awayScore } in PUT /api/me/gambles
  const body = { match: matchId, homeScore: payload.goalsA, awayScore: payload.goalsB };
  return backend.put('/api/me/gambles', body);
}

export async function apiGetMyForecast(matchId) {
  // Use query on /api/me/gambles to filter by match
  const url = `/api/me/gambles?match=${encodeURIComponent(matchId)}`;
  const data = await backend.get(url);
  // backend returns an array; return first or null
  if (Array.isArray(data)) return data[0] ?? null;
  return data;
}

export async function apiListForecasts(matchId, tournamentId) {
  // To retrieve all users' forecasts for a match we call the tournament gambles
  // endpoint and filter by match id. If tournamentId not provided, try /me/gambles?match=
  if (tournamentId) {
    const all = await backend.get(`/api/me/tournaments/${tournamentId}/gambles`);
    if (Array.isArray(all)) return all.filter((g) => g.match === matchId);
    return (all.items ?? []).filter((g) => g.match === matchId);
  }
  const byMatch = await backend.get(`/api/me/gambles?match=${encodeURIComponent(matchId)}`);
  return Array.isArray(byMatch) ? byMatch : byMatch.items ?? [];
}

export async function apiGetLeaderboard(tournamentId) {
  // Gambler route: /api/me/tournaments/:id/ranking
  return backend.get(`/api/me/tournaments/${tournamentId}/ranking`);
}

export async function apiDeleteForecast(id) {
  return backend.delete(`/api/me/gambles/${id}`);
}
