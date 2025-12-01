import { backend } from '../client.js';

export async function apiLogin({ email, password }) {
  // El backend monta las rutas bajo `/api`, por eso hay que llamar a `/api/login`
  return backend.post('/api/login', { email, password });
}

export async function apiMe() {
  return backend.get('/api/me');
}
