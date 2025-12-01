import { Backend } from './Backend.js';

// Permitir configurar la base del API desde Vite (VITE_API_BASE).
// En desarrollo usamos proxied /api (Vite) por lo que el valor por defecto
// queda en cadena vacía para usar el mismo origen: `/api/...`.
const baseUrl = import.meta.env.VITE_API_BASE ?? '';

export const backend = new Backend({
  apiKey: import.meta.env.VITE_API_KEY ?? 'default',
  baseUrl,
});

export function setAuthToken(token) {
  backend.setSessionToken(token);
}
