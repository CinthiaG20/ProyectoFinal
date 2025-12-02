import { backend } from '../client.js';

function mapGamble(g) {
  if (!g) return null;
  return {
    id: g.id,
    match: g.match,
    goalsA: g.homeScore ?? g.goalsA ?? null,
    goalsB: g.awayScore ?? g.goalsB ?? null,
    userId: g.user ?? g.userId,
    userEmail: g.userEmail,
    points: g.points,
    tournamentId: g.tournamentId ?? g.tournament,
    dateCreated: g.dateCreated,
    dateModified: g.dateModified,
  };
}

function mapList(data) {
  if (!data) return [];
  const arr = Array.isArray(data) ? data : data.items ?? [];
  return arr.map(mapGamble);
}

export async function apiCreateOrUpdateForecast(matchId, payload) {
  const queryUrl = `/api/me/gambles?match=${encodeURIComponent(matchId)}`;
  const existing = await backend.get(queryUrl);
  const first = Array.isArray(existing) ? existing[0] ?? null : (existing.items ?? [])[0] ?? null;
  const body = { match: matchId, homeScore: payload.goalsA, awayScore: payload.goalsB };

  if (first && first.id) {
    await backend.patch(`/api/me/gambles/${first.id}`, { homeScore: payload.goalsA, awayScore: payload.goalsB });
    return mapGamble({ ...first, homeScore: payload.goalsA, awayScore: payload.goalsB });
  }

  const created = await backend.put('/api/me/gambles', body);
  return mapGamble(created);
}

export async function apiGetMyForecast(matchId) {
  const url = `/api/me/gambles?match=${encodeURIComponent(matchId)}`;
  const data = await backend.get(url);
  if (Array.isArray(data)) return mapGamble(data[0] ?? null);
  const first = (data.items ?? [])[0] ?? null;
  return mapGamble(first);
}

export async function apiListMyForecasts() {
  const data = await backend.get('/api/me/gambles');
  return mapList(data);
}

export async function apiListForecasts(matchId, tournamentId) {
  if (tournamentId) {
    const all = await backend.get(`/api/me/tournaments/${tournamentId}/gambles`);
    return mapList(all).filter((g) => g.match === matchId);
  }
  const byMatch = await backend.get(`/api/me/gambles?match=${encodeURIComponent(matchId)}`);
  return mapList(byMatch);
}

export async function apiGetLeaderboard(tournamentId) {
  return backend.get(`/api/me/tournaments/${tournamentId}/ranking`);
}

export async function apiDeleteForecast(id) {
  await backend.delete(`/api/me/gambles/${id}`);
  return { deleted: true };
}
