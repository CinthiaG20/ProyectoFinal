import { createContext, useEffect, useState } from 'react';
import { setAuthToken } from '../api/client.js';
import { apiLogin, apiMe } from '../api/endpoints/auth.js';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'penca_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  function normalizeUser(raw) {
    if (!raw) return null;

    const rolesValue = raw.roles ?? raw.role ?? '';
    return {
      ...raw,
      roles: rolesValue,
      role: typeof rolesValue === 'string' ? rolesValue.toUpperCase() : '',
    };
  }

=======
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
>>>>>>> main
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
<<<<<<< HEAD
=======
      /* Ignorar fallos */
>>>>>>> main
    } finally {
      setLoading(false);
    }
  }, []);

<<<<<<< HEAD
=======
  //
  // LOGIN
  //
>>>>>>> main
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
<<<<<<< HEAD
      const message =
        err?.payload?.error ||
        (err instanceof Error ? err.message : String(err));
=======
      // Backend errors from Backend.fetch include a `payload` with { error }
      const message = err?.payload?.error || (err instanceof Error ? err.message : String(err));
>>>>>>> main
      throw new Error(message || 'Error al iniciar sesión');
    }
  }

<<<<<<< HEAD
=======
  //
  // LOGOUT
  //
>>>>>>> main
  function logout() {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

<<<<<<< HEAD
=======
  //
  // REFRESH USER (apiMe solo devuelve username → fusionar datos)
  //
>>>>>>> main
  async function refreshUser() {
    if (!token) return null;

    let me;
    try {
<<<<<<< HEAD
      me = await apiMe();
    } catch (err) {
=======
      me = await apiMe(); // { username }
    } catch (err) {
      // No forzar fallo en la app si refresh falla; devolver null
>>>>>>> main
      return null;
    }

    setUser((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        username: me.username,
      };

<<<<<<< HEAD
=======
      // guardar actualizado en localStorage
>>>>>>> main
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        window.localStorage.setItem(
          STORAGE_KEY,
<<<<<<< HEAD
          JSON.stringify({ ...parsed, user: updated })
=======
          JSON.stringify({ ...parsed, user: updated }),
>>>>>>> main
        );
      }

      return updated;
    });

    return me;
  }

<<<<<<< HEAD
=======
  //
  // Context value
  //
>>>>>>> main
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
