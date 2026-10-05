import { useSyncExternalStore } from 'react';
import type { SessionUser } from '../features/auth/session-api';

export type SessionState = {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
  clearUser: () => void;
};

let currentUser: SessionUser | null = null;
const listeners = new Set<() => void>();

const setUser = (user: SessionUser | null) => {
  currentUser = user;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getUser = () => currentUser;
const getServerUser = () => null;

export function useSessionStore<T>(selector: (state: SessionState) => T): T {
  const user = useSyncExternalStore(subscribe, getUser, getServerUser);
  return selector({ user, setUser, clearUser: () => setUser(null) });
}

export function setSessionUser(user: SessionUser | null): void {
  setUser(user);
}

export function clearSessionUser(): void {
  setUser(null);
}
