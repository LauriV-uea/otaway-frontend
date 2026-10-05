import Link from 'next/link';
import { PageHeading, PlaceCard, TourismLayout } from '../../features/tourism/components/TourismUI';
import useFavorites from '../../features/tourism/useFavorites';
import useTouristPlaces from '../../features/tourism/useTouristPlaces';

export default function FavoritesPage() {
  const { favoriteSlugs, ready, isFavorite, toggleFavorite } = useFavorites();
  const { places, loading, error } = useTouristPlaces();
  const favoritePlaces = places.filter((place) => favoriteSlugs.includes(place.id));

  return (
    <TourismLayout>
      <main className="tourism-main">
        <PageHeading
          eyebrow="Tu lista personal"
          title="Mis favoritos"
          description="Lugares guardados en este navegador para tenerlos a mano mientras planeas tu recorrido."
        />
        {!ready || loading ? (
          <p role="status">Cargando favoritos…</p>
        ) : error ? (
          <p className="tourism-feedback tourism-feedback--error" role="alert">{error}</p>
        ) : favoritePlaces.length === 0 ? (
          <section className="tourism-empty-state">
            <h2>Aún no has guardado lugares</h2>
            <p>Explora Otavalo y guarda los sitios que quieras visitar.</p>
            <Link className="tourism-button-link" href="/lugares">Explorar lugares</Link>
          </section>
        ) : (
          <div className="tourism-card-grid">
            {favoritePlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                favorite={isFavorite(place.id)}
                favoritesReady={ready}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </TourismLayout>
  );
}