export type TouristPlaceRecord = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  imageUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type TouristPlaceInput = {
  name: string;
  description?: string | null;
  location?: string | null;
  imageUrl?: string | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parsePlace = (value: unknown): TouristPlaceRecord => {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.name !== 'string' ||
    !(typeof value.description === 'string' || value.description === null) ||
    !(typeof value.location === 'string' || value.location === null) ||
    !(typeof value.imageUrl === 'string' || value.imageUrl === null) ||
    typeof value.status !== 'string' ||
    typeof value.createdAt !== 'string' ||
    typeof value.updatedAt !== 'string'
  ) {
    throw new Error('El backend devolvió un lugar turístico con formato inválido.');
  }

  return {
    id: value.id,
    name: value.name,
    description: value.description,
    location: value.location,
    imageUrl: value.imageUrl,
    status: value.status,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
};

const request = async (path: string, init: RequestInit = {}): Promise<unknown> => {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body !== undefined) headers.set('Content-Type', 'application/json');

  if (typeof window !== 'undefined') {
    const sessionToken = window.localStorage.getItem('otaway_session_token');
    if (sessionToken) headers.set('Authorization', `Bearer ${sessionToken}`);
  }

  const response = await fetch(path, {
    ...init,
    headers,
    credentials: 'same-origin',
  });

  if (response.status === 204) return null;

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = isRecord(payload) && isRecord(payload.error) && typeof payload.error.message === 'string'
      ? payload.error.message
      : `La solicitud falló (${response.status}).`;
    throw new Error(message);
  }

  return payload;
};

export const fetchTouristPlaces = async (): Promise<TouristPlaceRecord[]> => {
  const payload = await request('/api/tourist-places?page=1&pageSize=100');
  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    throw new Error('El backend devolvió una lista de lugares inválida.');
  }
  return payload.data.map(parsePlace);
};

export const fetchTouristPlace = async (id: string): Promise<TouristPlaceRecord> => {
  const payload = await request(`/api/tourist-places/${encodeURIComponent(id)}`);
  if (!isRecord(payload) || !('data' in payload)) {
    throw new Error('El backend devolvió un lugar inválido.');
  }
  return parsePlace(payload.data);
};

export const createTouristPlace = async (input: TouristPlaceInput): Promise<TouristPlaceRecord> => {
  const payload = await request('/api/tourist-places', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (!isRecord(payload) || !('data' in payload)) {
    throw new Error('El backend no confirmó la creación del lugar.');
  }
  return parsePlace(payload.data);
};

export const updateTouristPlace = async (
  id: string,
  input: TouristPlaceInput,
): Promise<TouristPlaceRecord> => {
  const payload = await request(`/api/tourist-places/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  if (!isRecord(payload) || !('data' in payload)) {
    throw new Error('El backend no confirmó la actualización del lugar.');
  }
  return parsePlace(payload.data);
};

export const deleteTouristPlace = async (id: string): Promise<void> => {
  await request(`/api/tourist-places/${encodeURIComponent(id)}`, { method: 'DELETE' });
};