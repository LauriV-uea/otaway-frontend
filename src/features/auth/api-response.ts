const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const AUTH_SERVICE_UNAVAILABLE_MESSAGE =
  'No se pudo conectar con el servicio de cuentas. Comprueba que el backend y sus servicios de autenticación estén activos.';

export const getApiErrorMessage = (payload: unknown): string | undefined => {
  if (!isRecord(payload)) return undefined;
  if (typeof payload.message === 'string') return payload.message;
  if (isRecord(payload.error) && typeof payload.error.message === 'string') {
    return payload.error.message;
  }
  return undefined;
};

export const getSessionToken = (payload: unknown): string | undefined => {
  if (!isRecord(payload) || !isRecord(payload.data)) return undefined;
  return typeof payload.data.sessionToken === 'string'
    ? payload.data.sessionToken
    : undefined;
};