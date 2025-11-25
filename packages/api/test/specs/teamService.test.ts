import { describe, expect, test } from 'vitest';
import { TEST_DB_KEY, TestApiClient } from './testUtils';

describe('Team Service', async () => {
  const apiTeams = '/api/teams';

  const teamData = {
    title: 'Test Team',
    description: 'A test team',
  };

  test('a manager user can operate with teams', async () => {
    const apiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    await apiClient.login('manager@example.com', 'manager');
    
    const createdTeam = await apiClient.create(apiTeams, {
      body: teamData,
    });
    const fetchedTeam = await apiClient.fetchOK(`${apiTeams}/${createdTeam.id}`);
    expect(fetchedTeam).toEqual(createdTeam);
    const otherTitle = 'Test Team Updated';
    const updatedTeam = await apiClient.fetchOK(`${apiTeams}/${createdTeam.id}`, {
      method: 'PATCH',
      body: { title: otherTitle },
    });
    expect(updatedTeam).toEqual({ updated: 1 });
    const fetchedUpdatedTeam = await apiClient.fetchOK(`${apiTeams}/${createdTeam.id}`);
    expect(Date.parse(fetchedUpdatedTeam.dateModified))
      .toBeGreaterThan(Date.parse(fetchedTeam.dateCreated));
    expect(fetchedUpdatedTeam).toEqual({
      ...createdTeam,
      dateModified: fetchedUpdatedTeam.dateModified,
      title: otherTitle,
    });

    await apiClient.fetchOK(`${apiTeams}/${createdTeam.id}`, { method: 'DELETE' });
    await apiClient.fetchFail(`${apiTeams}/${createdTeam.id}`, {}, 404);
  });
});
