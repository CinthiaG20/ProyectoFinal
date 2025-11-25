import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, logout as apiLogout, me } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const bootstrap = async () => {
      try {
        const stored = await AsyncStorage.getItem('pencas_token');
        if (stored) {
          setToken(stored);
          try {
            const profile = await me();
            setUser(profile);
          } catch {
            setToken(null);
            await AsyncStorage.removeItem('pencas_token');
          }
        }
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const signIn = async (email, password) => {
    const { token: newToken } = await apiLogin(email, password);
    setToken(newToken);
    await AsyncStorage.setItem('pencas_token', newToken);
    const profile = await me();
    setUser(profile);
  };

  const signOut = async () => {
    try {
      await apiLogout();
    } catch {}
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('pencas_token');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}