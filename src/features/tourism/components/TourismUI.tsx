import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { TouristPlaceRecord } from '../api';
import type { TouristPlace as CatalogTouristPlace } from '../catalog';
import useCurrentSession from '../../auth/useCurrentSession';

type TourismLayoutProps = {
  children: ReactNode;
};

export function TourismLayout({ children }: TourismLayoutProps) {
  const { user, loading } = useCurrentSession();

  return (
    <div className="tourism-shell">
      <header className="tourism-header">
        <div className="tourism-header-inner">
          <Link className="tourism-brand" href="/" aria-label="OtaWay, inicio">
            <span className="tourism-brand-mark" aria-hidden="true">O</span>
            <span>
              <strong>OtaWay</strong>
              <small>Otavalo, Ecuador</small>
            </span>
          </Link>
          <nav className="tourism-nav" aria-label="Navegación principal">
            <Link href="/lugares">Lugares</Link>
            <Link href="/gastronomia">Gastronomía</Link>
            <Link href="/eventos">Cultura</Link>
            <Link href="/favoritos">Favoritos</Link>
          </nav>
          {loading ? (
            <span className="tourism-account-link" aria-label="Cargando sesión" />
          ) : user ? (
            <Link className="tourism-account-link" href="/perfil">Perfil</Link>
          ) : (
            <Link className="tourism-account-link" href="/login">Ingresar</Link>
          )}
        </div>
      </header>
      {children}
      <footer className="tourism-footer">
        <Link className="tourism-footer-brand" href="/">OtaWay</Link>
        <span>Guía cultural y turística de Otavalo</span>
        <Link href="/admin">Administración</Link>
      </footer>
    </div>
  );
}

type TourismVisualProps = {
  label: string;
  tone: CatalogTouristPlace['tone'];
  imageSrc?: string;
};

export function TourismVisual({ label, tone, imageSrc }: TourismVisualProps) {
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const localImage = imageSrc?.startsWith('/images/') ? imageSrc : undefined;
  const remoteImage = (() => {
    if (!imageSrc || localImage) return undefined;
    try {
      const imageUrl = new URL(imageSrc);
      return imageUrl.protocol === 'https:' ? imageUrl.toString() : undefined;
    } catch {
      return undefined;
    }
  })();

  const hasImage = Boolean((localImage || remoteImage) && !imageUnavailable);

  return (
    <div className={`tourism-artwork tourism-artwork--${tone}${hasImage ? ' tourism-artwork--has-image' : ''}`} role="img" aria-label={label}>
      {localImage && !imageUnavailable && (
        <Image
          className="tourism-artwork-image"
          src={localImage}
          alt=""
          fill
          sizes="(max-width: 760px) 100vw, 33vw"
          onError={() => setImageUnavailable(true)}
        />
      )}
      {remoteImage && !imageUnavailable && (
        <Image
          className="tourism-artwork-image tourism-artwork-image--remote"
          src={remoteImage}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 760px) 100vw, 33vw"
          onError={() => setImageUnavailable(true)}
        />
      )}
      {imageSrc && imageUnavailable && (
        <span className="tourism-artwork-fallback" role="status">Imagen no disponible</span>
      )}
      <span className="tourism-artwork-sun" aria-hidden="true" />
      <span className="tourism-artwork-ridge" aria-hidden="true" />
      <span className="tourism-artwork-caption">{label}</span>
    </div>
  );
}

type PlaceCardProps = {
  place: TouristPlaceRecord | CatalogTouristPlace;
  favorite: boolean;
  favoritesReady: boolean;
  onToggleFavorite: (slug: string) => void;
};

export function PlaceCard({
  place,
  favorite,
  favoritesReady,
  onToggleFavorite,
}: PlaceCardProps) {
  const placeId = 'id' in place ? place.id : place.slug;
  const category = 'id' in place ? 'Lugar turístico' : place.category;
  const visual = 'id' in place ? place.name : place.visual;
  const tone = 'id' in place ? 'forest' : place.tone;
  const imageSrc = 'id' in place ? place.imageUrl ?? undefined : place.imageSrc;

  return (
    <article className="tourism-place-card">
      <TourismVisual label={visual} tone={tone} imageSrc={imageSrc} />
      <div className="tourism-card-body">
        <div className="tourism-card-overline">
          <span>{category}</span>
          <button
            className={`tourism-favorite-button${favorite ? ' is-saved' : ''}`}
            type="button"
            disabled={!favoritesReady}
            aria-label={`${favorite ? 'Quitar de' : 'Agregar a'} favoritos: ${place.name}`}
            aria-pressed={favorite}
            onClick={() => onToggleFavorite(placeId)}
            title={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <span aria-hidden="true">{favorite ? '♥' : '♡'}</span>
          </button>
        </div>
        <h2>{place.name}</h2>
        {place.description && <p className="tourism-card-description">{place.description}</p>}
        {place.location && <p className="tourism-location"><span aria-hidden="true">⌖</span> {place.location}</p>}
        <Link className="tourism-card-link" href={`/lugares/${placeId}`}>
          Ver detalles <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="tourism-page-heading">
      <p className="tourism-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}