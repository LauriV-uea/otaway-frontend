import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchTouristPlace } from '../../features/tourism/api';
import type { TouristPlaceRecord } from '../../features/tourism/api';
import { TourismLayout, TourismVisual } from '../../features/tourism/components/TourismUI';
import useFavorites from '../../features/tourism/useFavorites';

export default function TouristPlaceDetailPage() {
  const router = useRouter();
  const { isFavorite, ready, toggleFavorite } = useFavorites();
  const [loadedPlace, setLoadedPlace] = useState<{ id: string; place: TouristPlaceRecord } | null>(null);
  const [loadError, setLoadError] = useState<{ id: string; message: string } | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);
  const placeId = typeof router.query.slug === 'string' ? router.query.slug : undefined;

  useEffect(() => {
    if (!router.isReady || !placeId) return;

    let active = true;
    fetchTouristPlace(placeId)
      .then((result) => {
        if (active) setLoadedPlace({ id: placeId, place: result });
      })
      .catch((cause: unknown) => {
        if (active) {
          setLoadError({
            id: placeId,
            message: cause instanceof Error ? cause.message : 'No se pudo consultar el lugar.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [placeId, reloadVersion, router.isReady]);

  const place = loadedPlace && loadedPlace.id === placeId ? loadedPlace.place : null;
  const error = router.isReady
    ? placeId
      ? loadError?.id === placeId ? loadError.message : null
      : 'No se encontró el identificador del lugar.'
    : null;
  const loading = !router.isReady || Boolean(placeId && !place && !error);
  const favorite = place ? isFavorite(place.id) : false;

  return (
    <TourismLayout>
      <main className="tourism-main">
        {loading && <p role="status">Cargando lugar turístico…</p>}
        {error && (
          <div className="tourism-feedback tourism-feedback--error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                setLoadError(null);
                setReloadVersion((version) => version + 1);
              }}
            >
              Reintentar
            </button>
            <Link href="/lugares">Volver a lugares</Link>
          </div>
        )}
        {!loading && !error && place && (
          <section className="tourism-detail">
            <TourismVisual label={place.name} tone="forest" imageSrc={place.imageUrl ?? undefined} />
            <div className="tourism-detail-copy">
              <Link className="tourism-detail-back" href="/lugares">← Lugares turísticos</Link>
              <p className="tourism-eyebrow">Lugar turístico</p>
              <h1>{place.name}</h1>
              {place.description && <p>{place.description}</p>}
              {place.location && <p className="tourism-location"><span aria-hidden="true">⌖</span> {place.location}</p>}
              <button
                className="tourism-button-link"
                type="button"
                disabled={!ready}
                aria-pressed={favorite}
                onClick={() => toggleFavorite(place.id)}
              >
                {favorite ? '♥ Guardado en favoritos' : '♡ Guardar en favoritos'}
              </button>
            </div>
          </section>
        )}
      </main>
    </TourismLayout>
  );
}