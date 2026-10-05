
import Link from 'next/link';
import AdminLayout from '../../../layouts/AdminLayout';
import { PlaceCard } from '../../../features/tourism/components/TourismUI';
import useFavorites from '../../../features/tourism/useFavorites';
import useTouristPlaces from '../../../features/tourism/useTouristPlaces';

export default function FavoritesPage() {
  const { favoriteSlugs, ready, isFavorite, toggleFavorite } = useFavorites();
  const { places, loading, error } = useTouristPlaces();
  const favorites = places.filter((place) => favoriteSlugs.includes(place.id));

  return (
    <AdminLayout title="Mis favoritos">
      {!ready || loading ? (
        <p role="status">Cargando favoritos…</p>
      ) : error ? (
        <p className="tourism-feedback tourism-feedback--error" role="alert">{error}</p>
      ) : favorites.length === 0 ? (
        <section className="tourism-empty-state">
          <h2>Aún no has guardado lugares</h2>
          <p>Explora el catálogo y guarda los sitios que quieras visitar.</p>
          <Link className="tourism-button-link" href="/admin/tourist-places">Explorar lugares</Link>
        </section>
      ) : (
        <div className="tourism-card-grid">
          {favorites.map((favorite) => (
            <PlaceCard
              key={favorite.id}
              place={favorite}
              favorite={isFavorite(favorite.id)}
              favoritesReady={ready}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
} 