import { useEffect, useState } from 'react';

import { fetchCurrentSession } from './session-api';
import type { SessionUser } from './session-api';
import { setSessionUser } from '../../store/sessionStore';

export default function useCurrentSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      fetchCurrentSession()
        .then((session) => {
          if (active) {
            setUser(session);
            setSessionUser(session);
          }
        })
        .catch((cause: unknown) => {
          if (active) setError(cause instanceof Error ? cause.message : 'No se pudo consultar la sesión.');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    };

    window.addEventListener('storage', refresh);
    window.addEventListener('otaway-session-changed', refresh);
    refresh();

    return () => {
      active = false;
      window.removeEventListener('storage', refresh);
      window.removeEventListener('otaway-session-changed', refresh);
    };
  }, []);

  return { user, loading, error };
}