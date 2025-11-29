import { createContext, useEffect, useState } from 'react';
import { setAuthToken } from '../api/client.js';
import { apiLogin, apiMe } from '../api/endpoints/auth.js';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'penca_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  //
  // Normaliza usuario recibido desde el backend
  //
  function normalizeUser(raw) {
    if (!raw) return null;

    return {
      ...raw,
      roles: raw.roles,                 // backend: 'admin' | 'manager' | 'gambler'
      role: raw.roles.toUpperCase(),    // frontend: 'ADMIN' | 'MANAGER' | 'GAMBLER'
    };
  }

  //
  // Cargar sesión desde localStorage
  //
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const { token: storedToken, user: storedUser } = JSON.parse(stored);
      if (storedToken && storedUser) {
        const normalized = normalizeUser(storedUser);
        setAuthToken(storedToken);
        setToken(storedToken);
        setUser(normalized);
      }
    } catch {
      /* Ignorar fallos */
    } finally {
      setLoading(false);
    }
  }, []);

  //
  // LOGIN
  //
  async function login({ email, password }) {
    try {
      const data = await apiLogin({ email, password });

      const normalizedUser = normalizeUser(data.user);

      const session = {
        token: data.token,
        user: normalizedUser,
      };

      setToken(data.token);
      setUser(normalizedUser);
      setAuthToken(data.token);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

      return { ...data, user: normalizedUser };
    } catch (err) {
      // Backend errors from Backend.fetch include a `payload` with { error }
      const message = err?.payload?.error || (err instanceof Error ? err.message : String(err));
      throw new Error(message || 'Error al iniciar sesión');
    }
  }

  //
  // LOGOUT
  //
  function logout() {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  //
  // REFRESH USER (apiMe solo devuelve username → fusionar datos)
  //
  async function refreshUser() {
    if (!token) return null;

    let me;
    try {
      me = await apiMe(); // { username }
    } catch (err) {
      // No forzar fallo en la app si refresh falla; devolver null
      return null;
    }

    setUser((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        username: me.username,
      };

      // guardar actualizado en localStorage
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...parsed, user: updated }),
        );
      }

      return updated;
    });

    return me;
  }

  //
  // Context value
  //
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
