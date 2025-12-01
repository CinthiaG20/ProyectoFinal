import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext } from 'react';
import { token } from "../api";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  AsyncStorage.setItem(token);
  
  return (
    <AuthContext.Provider
      value={{
        token
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