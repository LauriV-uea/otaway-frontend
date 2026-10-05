import { useSyncExternalStore } from 'react';
import { FAVORITES_STORAGE_KEY } from './catalog';

const FAVORITES_CHANGED_EVENT = 'otaway-favorites-changed';
const EMPTY_FAVORITES: string[] = [];
let cachedStorageValue: string | null | undefined;
let cachedFavorites = EMPTY_FAVORITES;
let favoritesReady = false;

const parseFavorites = (storageValue: string | null): string[] => {
  try {
    const storedValue: unknown = JSON.parse(storageValue ?? '[]');
    if (!Array.isArray(storedValue)) return [];
    return [...new Set(storedValue.filter(
      (slug): slug is string => typeof slug === 'string',
    ))];
  } catch {
    return [];
  }
};

const getFavoritesSnapshot = (): string[] => {
  try {
    const storageValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (storageValue !== cachedStorageValue) {
      cachedStorageValue = storageValue;
      cachedFavorites = parseFavorites(storageValue);
    }
    return cachedFavorites;
  } catch {
    return EMPTY_FAVORITES;
  }
};

const subscribeToFavorites = (onStoreChange: () => void) => {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(FAVORITES_CHANGED_EVENT, onStoreChange);
  favoritesReady = true;
  onStoreChange();

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(FAVORITES_CHANGED_EVENT, onStoreChange);
  };
};

const getFavoritesReadySnapshot = () => favoritesReady;
const getServerFavoritesSnapshot = () => EMPTY_FAVORITES;
const getServerReadySnapshot = () => false;

export default function useFavorites() {
  const favoriteSlugs = useSyncExternalStore(
    subscribeToFavorites,
    getFavoritesSnapshot,
    getServerFavoritesSnapshot,
  );
  const ready = useSyncExternalStore(
    subscribeToFavorites,
    getFavoritesReadySnapshot,
    getServerReadySnapshot,
  );

  const toggleFavorite = (slug: string) => {
    try {
      const currentFavorites = getFavoritesSnapshot();
      const nextFavorites = currentFavorites.includes(slug)
        ? currentFavorites.filter((favoriteSlug) => favoriteSlug !== slug)
        : [...currentFavorites, slug];
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
      window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
    } catch {}
  };

  return {
    favoriteSlugs,
    isFavorite: (slug: string) => favoriteSlugs.includes(slug),
    ready,
    toggleFavorite,
  };
}