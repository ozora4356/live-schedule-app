'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Channel } from '../types';

type FavoriteContextType = {
  favorites: Channel[];
  toggleFavorite: (channel: Channel) => void;
  isFavorite: (channelId: string) => boolean;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined,
);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Channel[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('favoriteChannels');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = (channel: Channel) => {
    setFavorites((prev) => {
      const newFavorites = prev.some((fav) => fav.id === channel.id)
        ? prev.filter((fav) => fav.id !== channel.id)
        : [...prev, channel];

      localStorage.setItem('favoriteChannels', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (channelId: string) => {
    return favorites.some((fav) => fav.id === channelId);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}
