import { describe, expect, test } from 'vitest';
import { Invitation, Match, Ranking, Tournament } from '../../src/domain/types';
import { TEST_DB_KEY, TestApiClient } from './testUtils';

describe('Gamble Service', async () => {
  const apiTournaments = '/api/tournaments';
  const apiMatches = '/api/matches';
  const apiInvitations = '/api/invitations';
  const apiMyTournaments = '/api/me/tournaments';
  const apiMyInvitations = '/api/me/invitations';
  const apiMyGambles = '/api/me/gambles';

  test('a gambler can gamble', async () => {
    const managerApiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    await managerApiClient.login('manager@example.com', 'manager');
    const gamblerApiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    const { userId: gamblerId } = await gamblerApiClient.login('gambler@example.com', 'gambler');

    const managerTournaments = await managerApiClient.fetchOK(apiTournaments) as Tournament[];
    expect(managerTournaments.length).toBeGreaterThan(0);
    const createdInvitation = await managerApiClient.create(apiInvitations, {
      body: { invitedGambler: gamblerId, tournament: managerTournaments[0].id },
    }) as Invitation;
    await gamblerApiClient.fetchOK(
      `${apiMyInvitations}/${createdInvitation.id}/accept`,
      { method: 'POST' },
    ) as Invitation;
    const gamblerTournaments = await gamblerApiClient.fetchOK(apiMyTournaments) as Tournament[];
    expect(gamblerTournaments.length).toBeGreaterThan(0);
    const tournament = gamblerTournaments[0];
    const gamblerMatches = await gamblerApiClient.fetchOK(`${apiMyTournaments}/${tournament.id}/matches`) as Match[];
    expect(gamblerMatches.length).toBeGreaterThan(0);
    const rankingBeforeGamble = await gamblerApiClient.fetchOK(`${apiMyTournaments}/${tournament.id}/ranking`) as Ranking[];
    expect(rankingBeforeGamble).toContainEqual(expect.objectContaining({ user: gamblerId, points: 0 }));

    const gambleData = {
      user: gamblerId,
      match: gamblerMatches[0].id,
      homeScore: 2,
      awayScore: 1,
    };

    const createdGamble = await gamblerApiClient.create(apiMyGambles, {
      body: gambleData,
    });
    const fetchedGamble = await gamblerApiClient.fetchOK(`${apiMyGambles}/${createdGamble.id}`);
    expect(fetchedGamble).toEqual(createdGamble);
    const myGambles = await gamblerApiClient.fetchOK(apiMyGambles);
    expect(myGambles).toContainEqual(createdGamble);
    const myTournamentGambles = await gamblerApiClient.fetchOK(`${apiMyTournaments}/${tournament.id}/gambles`);
    expect(myTournamentGambles).toContainEqual(createdGamble);

    const rankingBeforeScore = await gamblerApiClient.fetchOK(`${apiMyTournaments}/${tournament.id}/ranking`) as Ranking[];
    expect(rankingBeforeScore).toContainEqual(expect.objectContaining({ user: gamblerId, points: 0 }));
    
    const otherScores = { homeScore: 3, awayScore: 2 };
    const updatedGamble = await gamblerApiClient.fetchOK(`${apiMyGambles}/${createdGamble.id}`, {
      method: 'PATCH',
      body: otherScores,
    });
    expect(updatedGamble).toEqual({ updated: 1 });
    const fetchedUpdatedGamble = await gamblerApiClient.fetchOK(`${apiMyGambles}/${createdGamble.id}`);
    expect(Date.parse(fetchedUpdatedGamble.dateModified))
      .toBeGreaterThan(Date.parse(fetchedGamble.dateCreated));
    expect(fetchedUpdatedGamble).toEqual({
      ...createdGamble,
      ...otherScores,
      dateModified: fetchedUpdatedGamble.dateModified,
    });

    await gamblerApiClient.fetchOK(`${apiMyGambles}/${createdGamble.id}`, { method: 'DELETE' });
    await gamblerApiClient.fetchFail(`${apiMyGambles}/${createdGamble.id}`, {}, 404);
    const myGamblesAfterDelete = await gamblerApiClient.fetchOK(apiMyGambles);
    expect(myGamblesAfterDelete).not.toContainEqual(createdGamble);
    const myTournamentGamblesAfterDelete = await gamblerApiClient.fetchOK(`${apiMyTournaments}/${tournament.id}/gambles`);
    expect(myTournamentGamblesAfterDelete).not.toContainEqual(createdGamble);

    const anotherGamble = await gamblerApiClient.create(apiMyGambles, {
      body: gambleData,
    });
    await managerApiClient.fetchOK(`${apiMatches}/${gambleData.match}`, {
      method: 'PATCH',
      body: otherScores,
    });
    const rankingAfterScore = await gamblerApiClient.fetchOK(`${apiMyTournaments}/${tournament.id}/ranking`) as Ranking[];
    expect(rankingAfterScore).toContainEqual(expect.objectContaining({ user: gamblerId, points: 3 }));

    await gamblerApiClient.fetchFail(`${apiMyGambles}/${anotherGamble.id}`, {
      method: 'PATCH',
      body: otherScores,
    }, 400);
    await gamblerApiClient.fetchFail(`${apiMyGambles}/${anotherGamble.id}`, { method: 'DELETE' }, 400);
  });
});
