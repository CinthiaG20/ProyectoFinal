import { describe, expect, test } from 'vitest';
import { Team, Tournament } from '../../src/domain/types';
import { TEST_DB_KEY, TestApiClient } from './testUtils';

describe('Match Service', async () => {
  const apiMatches = '/api/matches';
  const apiTournaments = '/api/tournaments';
  const apiTeams = '/api/teams';

  test('a manager user can operate with matches', async () => {
    const apiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    await apiClient.login('manager@example.com', 'manager');
    
    const tournaments = await apiClient.fetchOK(apiTournaments) as Tournament[];
    expect(tournaments.length).toBeGreaterThan(0);
    const teams = await apiClient.fetchOK(apiTeams) as Team[];
    expect(teams.length).toBeGreaterThan(1);

    const matchData = {
      title: 'Test Match',
      date: new Date().toISOString(),
      tournament: tournaments[0].id,
      homeTeam: teams[0].id,
      awayTeam: teams[1].id,
      homeScore: null,
      awayScore: null,
    };

    const createdMatch = await apiClient.create(apiMatches, {
      body: matchData,
    });
    const fetchedMatch = await apiClient.fetchOK(`${apiMatches}/${createdMatch.id}`);
    expect(fetchedMatch).toEqual(createdMatch);
    const scores = { homeScore: 1, awayScore: 2 };
    const updatedMatch = await apiClient.fetchOK(`${apiMatches}/${createdMatch.id}`, {
      method: 'PATCH',
      body: scores,
    });
    expect(updatedMatch).toEqual({ updated: 1 });
    const fetchedUpdatedMatch = await apiClient.fetchOK(`${apiMatches}/${createdMatch.id}`);
    expect(Date.parse(fetchedUpdatedMatch.dateModified))
      .toBeGreaterThan(Date.parse(fetchedMatch.dateCreated));
    expect(fetchedUpdatedMatch).toEqual({
      ...createdMatch,
      ...scores,
      dateModified: fetchedUpdatedMatch.dateModified,
    });

    await apiClient.fetchOK(`${apiMatches}/${createdMatch.id}`, { method: 'DELETE' });
    await apiClient.fetchFail(`${apiMatches}/${createdMatch.id}`, {}, 404);
  });
});
