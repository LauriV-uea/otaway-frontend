import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  culturalEvents,
  gastronomy,
} from '../features/tourism/catalog';
import {
  PlaceCard,
  TourismLayout,
  TourismVisual,
} from '../features/tourism/components/TourismUI';
import useFavorites from '../features/tourism/useFavorites';
import useTouristPlaces from '../features/tourism/useTouristPlaces';

export default function Home() {
  const { ready, isFavorite, toggleFavorite } = useFavorites();
  const { places, loading, error, reload } = useTouristPlaces();
  const [search, setSearch] = useState('');
  const searchTerm = search.trim().toLocaleLowerCase('es');
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const heroImage = places.find((place) => place.imageUrl?.startsWith('https://'))?.imageUrl;
  const filteredPlaces = places.filter((place) =>
    `${place.name} ${place.location ?? ''} ${place.description ?? ''}`
      .toLocaleLowerCase('es')
      .includes(searchTerm),
  );

  return (
    <TourismLayout>
      <section className={`tourism-home-hero${heroImage && !heroImageFailed ? ' tourism-home-hero--photo' : ''}`}>
        {heroImage && !heroImageFailed && (
          <Image
            className="tourism-hero-image"
            src={heroImage}
            alt=""
            fill
            unoptimized
            sizes="100vw"
            onError={() => setHeroImageFailed(true)}
          />
        )}
        <div className="tourism-hero-content">
          <p className="tourism-eyebrow">OtaWay · Otavalo, Ecuador</p>
          <h1>Descubre Otavalo a tu manera.</h1>
          <p>Encuentra paisajes andinos, cultura viva y lugares que hacen único este territorio.</p>
          <div className="tourism-search" role="search" aria-label="Buscar atractivos turísticos">
            <span aria-hidden="true">⌕</span>
            <input
              id="home-place-search"
              type="search"
              aria-label="Busca por lugar, comunidad o paisaje"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Busca un lugar, comunidad o paisaje"
            />
            <Link href="/lugares" aria-label="Ver todos los lugares">Explorar</Link>
          </div>
        </div>
      </section>

      <main className="tourism-main">
        <nav className="tourism-quick-links" aria-label="Explorar por categoría">
          <Link href="/lugares"><span aria-hidden="true">⌖</span> Lugares</Link>
          <Link href="/gastronomia"><span aria-hidden="true">◉</span> Gastronomía</Link>
          <Link href="/eventos"><span aria-hidden="true">✳</span> Cultura</Link>
          <Link href="/favoritos"><span aria-hidden="true">♡</span> Favoritos</Link>
        </nav>
        <section className="tourism-section" aria-labelledby="featured-places">
          <div className="tourism-section-heading">
            <div>
              <p className="tourism-eyebrow">Paisajes y encuentros</p>
              <h2 id="featured-places">{search ? 'Resultados de tu búsqueda' : 'Lugares que cuentan historias'}</h2>
            </div>
            <Link href="/lugares">Ver todos los lugares <span aria-hidden="true">→</span></Link>
          </div>
          {loading && <div className="tourism-loading-grid" role="status" aria-label="Cargando lugares turísticos"><span /><span /><span /></div>}
          {error && (
            <div className="tourism-feedback tourism-feedback--error" role="alert">
              <p>{error}</p>
              <button type="button" onClick={reload}>Reintentar</button>
            </div>
          )}
          {!loading && !error && places.length === 0 && (
            <p className="tourism-empty-copy">Todavía no hay lugares publicados.</p>
          )}
          {!loading && !error && places.length > 0 && filteredPlaces.length === 0 && (
            <p className="tourism-empty-copy">No encontramos lugares que coincidan con “{search}”. Prueba con otro término.</p>
          )}
          {!loading && !error && filteredPlaces.length > 0 && <div className="tourism-card-grid">
            {filteredPlaces.slice(0, 3).map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                favorite={isFavorite(place.id)}
                favoritesReady={ready}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>}
        </section>

        <section className="tourism-section" aria-labelledby="local-flavors">
          <div className="tourism-section-heading">
            <div>
              <p className="tourism-eyebrow">Tradición en cada mesa</p>
              <h2 id="local-flavors">Sabores de Otavalo</h2>
            </div>
            <Link href="/gastronomia">Descubrir gastronomía <span aria-hidden="true">→</span></Link>
          </div>
          <div className="tourism-card-grid">
            {gastronomy.slice(0, 3).map((food) => (
              <article className="tourism-simple-card" key={food.slug}>
                <TourismVisual label={food.visual} tone={food.tone} imageSrc={food.imageSrc} />
                <h2>{food.name}</h2>
                <p>{food.description}</p>
                <p className="tourism-note">{food.culturalNote}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tourism-section" aria-labelledby="living-culture">
          <div className="tourism-section-heading">
            <div>
              <p className="tourism-eyebrow">Calendario cultural</p>
              <h2 id="living-culture">Tradiciones que siguen vivas</h2>
            </div>
            <Link href="/eventos">Conocer celebraciones <span aria-hidden="true">→</span></Link>
          </div>
          <p className="tourism-demo-note">Referencias culturales. Las fechas exactas dependen de la programación de cada año.</p>
          <div className="tourism-card-grid">
            {culturalEvents.slice(0, 3).map((event) => (
              <article className="tourism-simple-card" key={event.slug}>
                <TourismVisual label={event.visual} tone={event.tone} imageSrc={event.imageSrc} />
                <h2>{event.name}</h2>
                <p>{event.description}</p>
                <p className="tourism-note">{event.season}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </TourismLayout>
  );
}





