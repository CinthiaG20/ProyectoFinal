import * as InvitationsApi from '../../api/endpoints/invitations.js';

export function useInvitationsApi() {
  return {
    listInvitations: InvitationsApi.apiListMyInvitations,
    acceptInvitation: InvitationsApi.apiAcceptInvitation,
    rejectInvitation: InvitationsApi.apiRejectInvitation,
  };
}
