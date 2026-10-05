export type SessionRole = {
  id: string;
  code: string;
  name: string;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  roles: SessionRole[];
};

export type OwnProfile = {
  firstName: string;
  lastName: string;
  email: string;
  username: string | null;
  roles: SessionRole[];
  phone: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  xUrl: string | null;
  githubUrl: string | null;
  tiktokUrl: string | null;
  websiteUrl: string | null;
  hasAvatar: boolean;
  avatarUpdatedAt: string | null;
  profileUpdatedAt: string;
};

export type OwnProfileInput = {
  firstName?: string;
  lastName?: string;
  expectedProfileUpdatedAt: string;
};

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseRoles = (value: unknown): SessionRole[] => {
  if (!Array.isArray(value)) throw new Error('El backend devolvió roles con formato inválido.');
  return value.map((role) => {
    if (
      !isRecord(role) ||
      typeof role.id !== 'string' ||
      typeof role.code !== 'string' ||
      typeof role.name !== 'string'
    ) {
      throw new Error('El backend devolvió un rol con formato inválido.');
    }
    return { id: role.id, code: role.code, name: role.name };
  });
};

const parseSessionUser = (value: unknown): SessionUser => {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.email !== 'string' ||
    typeof value.name !== 'string'
  ) {
    throw new Error('El backend devolvió una sesión con formato inválido.');
  }
  return { id: value.id, email: value.email, name: value.name, roles: parseRoles(value.roles) };
};

const parseOwnProfile = (value: unknown): OwnProfile => {
  if (
    !isRecord(value) ||
    typeof value.firstName !== 'string' ||
    typeof value.lastName !== 'string' ||
    typeof value.email !== 'string' ||
    !(typeof value.username === 'string' || value.username === null) ||
    typeof value.phone !== 'string' && value.phone !== null ||
    typeof value.hasAvatar !== 'boolean' ||
    typeof value.profileUpdatedAt !== 'string'
  ) {
    throw new Error('El backend devolvió un perfil con formato inválido.');
  }

  const nullableString = (field: string): string | null => {
    const fieldValue = value[field];
    if (typeof fieldValue === 'string' || fieldValue === null) return fieldValue;
    throw new Error('El backend devolvió un campo de perfil con formato inválido.');
  };

  return {
    firstName: value.firstName,
    lastName: value.lastName,
    email: value.email,
    username: value.username,
    roles: parseRoles(value.roles),
    phone: value.phone,
    facebookUrl: nullableString('facebookUrl'),
    instagramUrl: nullableString('instagramUrl'),
    linkedinUrl: nullableString('linkedinUrl'),
    xUrl: nullableString('xUrl'),
    githubUrl: nullableString('githubUrl'),
    tiktokUrl: nullableString('tiktokUrl'),
    websiteUrl: nullableString('websiteUrl'),
    hasAvatar: value.hasAvatar,
    avatarUpdatedAt: nullableString('avatarUpdatedAt'),
    profileUpdatedAt: value.profileUpdatedAt,
  };
};

const requestJson = async (path: string, init: RequestInit = {}): Promise<unknown> => {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body !== undefined) headers.set('Content-Type', 'application/json');

  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('otaway_session_token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(path, { ...init, headers, credentials: 'same-origin' });
  const payload: unknown = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const message = isRecord(payload) && isRecord(payload.error) && typeof payload.error.message === 'string'
      ? payload.error.message
      : `La solicitud falló (${response.status}).`;
    throw new ApiRequestError(message, response.status);
  }

  return payload;
};

export const fetchCurrentSession = async (): Promise<SessionUser | null> => {
  try {
    const payload = await requestJson('/api/auth/session');
    if (!isRecord(payload) || !('data' in payload)) {
      throw new Error('El backend devolvió una sesión con formato inválido.');
    }
    return parseSessionUser(payload.data);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) return null;
    throw error;
  }
};

export const fetchOwnProfile = async (): Promise<OwnProfile> => {
  const payload = await requestJson('/api/profile');
  if (!isRecord(payload) || !('data' in payload)) {
    throw new Error('El backend devolvió un perfil con formato inválido.');
  }
  return parseOwnProfile(payload.data);
};

export const updateOwnProfile = async (input: OwnProfileInput): Promise<OwnProfile> => {
  const payload = await requestJson('/api/profile', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  if (!isRecord(payload) || !('data' in payload)) {
    throw new Error('El backend no confirmó la actualización del perfil.');
  }
  return parseOwnProfile(payload.data);
};

export const logoutCurrentSession = async (): Promise<void> => {
  try {
    await requestJson('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    if (!(error instanceof ApiRequestError && error.status === 401)) throw error;
  }

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('otaway_session_token');
    window.dispatchEvent(new Event('otaway-session-changed'));
  }
};