import { describe, expect, test } from 'vitest';
import { TEST_DB_KEY, TestApiClient } from './testUtils';

describe('Tournament Service', async () => {
  const apiTournaments = '/api/tournaments';

  const tournamentData = {
    name: 'Test Tournament',
    description: 'A test tournament',
    beginning: new Date().toISOString(),
    ending: new Date(Date.now() + 864e5 * 30).toISOString(),
  };

  test('a manager user can operate with tournaments', async () => {
    const apiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    await apiClient.login('manager@example.com', 'manager');
    
    const createdTournament = await apiClient.create(apiTournaments, {
      body: tournamentData,
    });
    const fetchedTournament = await apiClient.fetchOK(`${apiTournaments}/${createdTournament.id}`);
    expect(fetchedTournament).toEqual(createdTournament);
    const otherName = 'Test Tournament Updated';
    const updatedTournament = await apiClient.fetchOK(`${apiTournaments}/${createdTournament.id}`, {
      method: 'PATCH',
      body: { name: otherName },
    });
    expect(updatedTournament).toEqual({ updated: 1 });
    const fetchedUpdatedTournament = await apiClient.fetchOK(`${apiTournaments}/${createdTournament.id}`);
    expect(Date.parse(fetchedUpdatedTournament.dateModified))
      .toBeGreaterThan(Date.parse(fetchedTournament.dateCreated));
    expect(fetchedUpdatedTournament).toEqual({
      ...createdTournament,
      dateModified: fetchedUpdatedTournament.dateModified,
      name: otherName,
    });

    await apiClient.fetchOK(`${apiTournaments}/${createdTournament.id}`, { method: 'DELETE' });
    await apiClient.fetchFail(`${apiTournaments}/${createdTournament.id}`, {}, 404);
  });
});
