import { Backend } from './Backend.js';

const baseUrl = import.meta.env.VITE_API_BASE ?? '';

export const backend = new Backend({
  apiKey: import.meta.env.VITE_API_KEY ?? 'default',
  baseUrl,
});

export function setAuthToken(token) {
  backend.setSessionToken(token);
}
