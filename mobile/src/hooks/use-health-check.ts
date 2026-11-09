import { useEffect, useState } from 'react';

import { fetchHealth, type HealthResponse } from '../services/health-service';

const CONNECTION_LOADING = 'loading';
const CONNECTION_SUCCESS = 'success';
const CONNECTION_ERROR = 'error';
type ConnectionState = typeof CONNECTION_LOADING | typeof CONNECTION_SUCCESS | typeof CONNECTION_ERROR;

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Ocorreu um erro inesperado.';
};

export const useHealthCheck = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(CONNECTION_LOADING);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const checkConnection = async (): Promise<void> => {
    setConnectionState(CONNECTION_LOADING);
    setErrorMessage('');
    try {
      const response = await fetchHealth();
      setHealth(response);
      setConnectionState(CONNECTION_SUCCESS);
    } catch (error) {
      setHealth(null);
      setErrorMessage(getErrorMessage(error));
      setConnectionState(CONNECTION_ERROR);
    }
  };
  useEffect(() => {
    let isMounted = true;
    void fetchHealth()
      .then((response) => {
        if (!isMounted) return;
        setHealth(response);
        setConnectionState(CONNECTION_SUCCESS);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setHealth(null);
        setErrorMessage(getErrorMessage(error));
        setConnectionState(CONNECTION_ERROR);
      });
    return () => {
      isMounted = false;
    };
  }, []);
  return { checkConnection, connectionState, errorMessage, health };
};
