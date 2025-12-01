import { backend } from '../client.js';

export async function apiListUsers() {
  return backend.get('/api/users');
}

export async function apiGetUser(id) {
  return backend.get(`/api/users/${id}`);
}

export async function apiCreateUser(payload) {
  return backend.post('/api/users', payload);
}

export async function apiUpdateUser(id, payload) {
  return backend.put(`/api/users/${id}`, payload);
}

export async function apiDeleteUser(id) {
  return backend.delete(`/api/users/${id}`);
}
