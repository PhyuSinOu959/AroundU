import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ImageKey = 'coffeeShop' | 'plantShop';

export type Shop = {
  id: string;
  name: string;
  distance: number;
  open: boolean;
  imageKey: ImageKey;
  categoryId: number;
};

type FavoritesContextValue = {
  favorites: Shop[];
  isFavorite: (shopId: string) => boolean;
  toggleFavorite: (shop: Shop) => void;
  removeFavorite: (shopId: string) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Shop[]>([]);

  const isFavorite = useCallback(
    (shopId: string) => favorites.some((f) => f.id === shopId),
    [favorites],
  );

  const toggleFavorite = useCallback((shop: Shop) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === shop.id);
      if (exists) {
        return prev.filter((f) => f.id !== shop.id);
      }
      return [...prev, shop];
    });
  }, []);

  const removeFavorite = useCallback((shopId: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== shopId));
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites }),
    [favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}
