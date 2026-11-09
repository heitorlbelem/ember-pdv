import { API_BASE_URL, HEALTH_PATH } from '../config/api';

const API_UNAVAILABLE_MESSAGE = 'Não foi possível conectar à API.';
const INVALID_RESPONSE_MESSAGE = 'A API retornou uma resposta inválida.';

export type HealthResponse = {
  status: string;
  database: string;
};

const isHealthResponse = (value: unknown): value is HealthResponse => {
  if (!value || typeof value !== 'object') return false;
  const response = value as Record<string, unknown>;
  return typeof response.status === 'string' && typeof response.database === 'string';
};

export const fetchHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}${HEALTH_PATH}`);
    const payload: unknown = await response.json();
    if (!response.ok) throw new Error(API_UNAVAILABLE_MESSAGE);
    if (!isHealthResponse(payload)) throw new Error(INVALID_RESPONSE_MESSAGE);
    return payload;
  } catch (error) {
    if (error instanceof Error && error.message !== API_UNAVAILABLE_MESSAGE) {
      throw new Error(API_UNAVAILABLE_MESSAGE);
    }
    throw error;
  }
};
