import { backend } from '../client.js';

export async function apiLogin({ email, password }) {
  return backend.post('/api/login', { email, password });
}

export async function apiMe() {
  return backend.get('/api/me');
}
