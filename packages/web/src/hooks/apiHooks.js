import { useEffect, useState } from 'react';
import { Backend } from '../api/Backend';

export const backend = new Backend({ apiKey: 'test-db' }); // FIXME: Use proper API key.

export function useApiLogin(email, password) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (email && password) {
      setIsLoading(true);
      backend.post('/api/login', { email, password }).then(
        (data) => {
          setData(data);
          setIsLoading(false);
        },
        (error) => {
          setError(error);
          setIsLoading(false);
        },
      );
    }
  }, [email, password]);

  return { data, isLoading, error };
}

export function useApiMe(sessionToken) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionToken) {
      setIsLoading(true);
      backend.get('/api/me', {
        headers: { Authorization: `Bearer ${sessionToken}` }
      }).then(
        (data) => {
          setData(data);
          setIsLoading(false);
        },
        (error) => {
          setError(error);
          setIsLoading(false);
        },
      );
    }
  }, [sessionToken]);

  return { data, isLoading, error };
}
