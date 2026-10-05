import { useEffect, useState } from 'react';

import { fetchTouristPlaces } from './api';
import type { TouristPlaceRecord } from './api';

export default function useTouristPlaces() {
  const [places, setPlaces] = useState<TouristPlaceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;

    fetchTouristPlaces()
      .then((result) => {
        if (active) setPlaces(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'No se pudieron consultar los lugares.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadVersion]);

  return {
    places,
    setPlaces,
    loading,
    error,
    reload: () => {
      setLoading(true);
      setError(null);
      setReloadVersion((version) => version + 1);
    },
  };
}