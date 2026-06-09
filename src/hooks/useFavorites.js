import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('wc2026-favorites', []);
  const toggleFavorite = useCallback((code) => {
    if (!code) return;
    setFavorites((current) => current.includes(code)
      ? current.filter((item) => item !== code)
      : [...current, code]);
  }, [setFavorites]);
  const isFavorited = useCallback((code) => favorites.includes(code), [favorites]);
  return { favorites, toggleFavorite, isFavorited };
}
