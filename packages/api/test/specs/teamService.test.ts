import { describe, expect, test } from 'vitest';
import { TEST_DB_KEY, TestApiClient } from './testUtils';

describe('Team Service', async () => {
  const apiTeams = '/api/teams';

  const teamData = {
    title: 'Test Team',
    description: 'A test team',
    logo: null,
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

  test('a gambler user can access GET endpoints for teams', async () => {
    const managerClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    await managerClient.login('manager@example.com', 'manager');

    const createdTeam = await managerClient.create(apiTeams, {
      body: teamData,
    });

    const gamblerClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    await gamblerClient.login('gambler@example.com', 'gambler');

    const teams = await gamblerClient.fetchOK(apiTeams);
    expect(Array.isArray(teams)).toBe(true);
    expect(teams.length).toBeGreaterThan(0);

    const fetchedTeam = await gamblerClient.fetchOK(`${apiTeams}/${createdTeam.id}`);
    expect(fetchedTeam).toEqual(createdTeam);

    await managerClient.fetchOK(`${apiTeams}/${createdTeam.id}`, { method: 'DELETE' });
  });

  test('logo field is validated to be a URL', async () => {
    const apiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    await apiClient.login('manager@example.com', 'manager');

    const invalidURL = 'not-a-url';
    await apiClient.fetchFail(apiTeams, {
      method: 'PUT',
      body: {
        ...teamData,
        logo: invalidURL,
      },
    }, 400);

    const validURL = 'https://example.com/logo.png';
    const createdTeam = await apiClient.create(apiTeams, {
      body: {
        ...teamData,
        logo: validURL,
      },
    });
    expect(createdTeam.logo).toBe(validURL);

    await apiClient.fetchFail(`${apiTeams}/${createdTeam.id}`, {
      method: 'PATCH',
      body: { logo: invalidURL },
    }, 400);

    await apiClient.fetchOK(`${apiTeams}/${createdTeam.id}`, { method: 'DELETE' });
  });
});
