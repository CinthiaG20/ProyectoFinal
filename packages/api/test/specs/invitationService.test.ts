import { describe, expect, test } from 'vitest';
import { Invitation, Tournament } from '../../src/domain/types';
import { TEST_DB_KEY, TestApiClient } from './testUtils';

describe('Invitation Service', async () => {
  const apiTournaments = '/api/tournaments';
  const apiInvitations = '/api/invitations';
  const apiMyTournaments = '/api/me/tournaments';
  const apiMyInvitations = '/api/me/invitations';

  test('a manager user can invite gamblers to tournaments', async () => {
    const managerApiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    const { userId: managerId } = await managerApiClient.login('manager@example.com', 'manager');
    const gamblerApiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    const { userId: gamblerId } = await gamblerApiClient.login('gambler@example.com', 'gambler');

    const managerTournaments = await managerApiClient.fetchOK(apiTournaments) as Tournament[];
    expect(managerTournaments.length).toBeGreaterThan(0);

    const gamblerInvitationsBefore = await gamblerApiClient.fetchOK(apiMyInvitations) as Invitation[];
    expect(gamblerInvitationsBefore.length).toBe(0);
    const gamblerTournamentsBefore = await gamblerApiClient.fetchOK(apiMyTournaments) as Tournament[];
    expect(gamblerTournamentsBefore.length).toBe(0);

    const invitationData = {
      invitedGambler: gamblerId,
      tournament: managerTournaments[0].id,
    };

    const createdInvitation = await managerApiClient.create(apiInvitations, { body: invitationData }, {
      ...invitationData, acceptedAt: null, revokedAt: null, invitingManager: managerId,
    }) as Invitation;
    const fetchedInvitation = await managerApiClient.fetchOK(`${apiInvitations}/${createdInvitation.id}`);
    expect(fetchedInvitation).toEqual(createdInvitation);

    const gamblerInvitationsAfter = await gamblerApiClient.fetchOK(apiMyInvitations) as Invitation[];
    expect(gamblerInvitationsAfter.length).toBe(1);
    expect(gamblerInvitationsAfter[0]).toEqual(createdInvitation);

    // Accept invitation
    const gamblerInvitationAccepted = await gamblerApiClient.fetchOK(
      `${apiMyInvitations}/${createdInvitation.id}/accept`,
      { method: 'POST' },
    ) as Invitation;
    expect(gamblerInvitationAccepted.acceptedAt).not.toBeNull();
    expect(gamblerInvitationAccepted.revokedAt).toBeNull();

    const gamblerTournamentsAfterAccept = await gamblerApiClient.fetchOK(apiMyTournaments) as Tournament[];
    expect(gamblerTournamentsAfterAccept.length).toBe(1);

    // Reject invitation
    const gamblerInvitationRevoked = await gamblerApiClient.fetchOK(
      `${apiMyInvitations}/${createdInvitation.id}/reject`,
      { method: 'POST' },
    ) as Invitation;
    expect(gamblerInvitationRevoked.acceptedAt).not.toBeNull();
    expect(gamblerInvitationRevoked.revokedAt).not.toBeNull();

    const gamblerTournamentsAfterReject = await gamblerApiClient.fetchOK(apiMyTournaments) as Tournament[];
    expect(gamblerTournamentsAfterReject.length).toBe(0);

    await managerApiClient.fetchOK(`${apiInvitations}/${createdInvitation.id}`, { method: 'DELETE' });
    await managerApiClient.fetchFail(`${apiInvitations}/${createdInvitation.id}`, {}, 404);
  });
});
