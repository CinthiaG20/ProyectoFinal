import { backend } from '../client.js';

export async function apiListMyInvitations() {
  return backend.get('/api/me/invitations');
}

export async function apiAcceptInvitation(id) {
  return backend.post(`/api/me/invitations/${id}/accept`, {});
}

export async function apiRejectInvitation(id) {
  return backend.post(`/api/me/invitations/${id}/reject`, {});
}
