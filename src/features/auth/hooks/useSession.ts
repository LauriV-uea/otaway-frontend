import { useState } from 'react';
import { useRouter } from 'next/router';

import { clearSessionUser } from '../../../store/sessionStore';
import { logoutCurrentSession } from '../session-api';

export function useLogoutMutation() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return {
    isPending,
    error,
    async mutate() {
      setIsPending(true);
      setError(null);
      try {
        await logoutCurrentSession();
        clearSessionUser();
        await router.replace('/');
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'No se pudo cerrar sesión.');
      } finally {
        setIsPending(false);
      }
    },
  };
}
