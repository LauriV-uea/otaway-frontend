import { useState } from 'react';
import { PageHeading, PlaceCard, TourismLayout } from '../../features/tourism/components/TourismUI';
import useTouristPlaces from '../../features/tourism/useTouristPlaces';
import useFavorites from '../../features/tourism/useFavorites';

export default function TouristPlacesPage() {
  const { ready, isFavorite, toggleFavorite } = useFavorites();
  const { places, loading, error, reload } = useTouristPlaces();
  const [search, setSearch] = useState('');
  const searchTerm = search.trim().toLocaleLowerCase('es');
  const filteredPlaces = places.filter((place) =>
    `${place.name} ${place.location ?? ''} ${place.description ?? ''}`
      .toLocaleLowerCase('es')
      .includes(searchTerm),
  );

  return (
    <TourismLayout>
      <main className="tourism-main">
        <PageHeading
          eyebrow="Naturaleza, cultura y comunidad"
          title="Lugares turísticos"
          description="Conoce algunos de los paisajes y espacios culturales más representativos de Otavalo y sus alrededores."
        />
        <label className="tourism-catalog-search" htmlFor="places-search">
          <span aria-hidden="true">⌕</span>
          <input
            id="places-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Buscar por nombre, ubicación o descripción"
          />
          <span className="tourism-search-count">{filteredPlaces.length} {filteredPlaces.length === 1 ? 'lugar' : 'lugares'}</span>
        </label>
        {loading && <div className="tourism-loading-grid" role="status" aria-label="Cargando lugares turísticos"><span /><span /><span /></div>}
        {error && (
          <div className="tourism-feedback tourism-feedback--error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={reload}>Reintentar</button>
          </div>
        )}
        {!loading && !error && places.length === 0 && (
          <section className="tourism-empty-state">
            <h2>Aún no hay lugares publicados</h2>
            <p>Los lugares aparecerán aquí cuando el equipo de Otaway los publique.</p>
          </section>
        )}
        {!loading && !error && places.length > 0 && filteredPlaces.length === 0 && (
          <section className="tourism-empty-state">
            <h2>No encontramos resultados</h2>
            <p>Prueba con otro nombre, ubicación o término.</p>
          </section>
        )}
        {!loading && !error && filteredPlaces.length > 0 && <div className="tourism-card-grid">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              favorite={isFavorite(place.id)}
              favoritesReady={ready}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>}
      </main>
    </TourismLayout>
  );
}