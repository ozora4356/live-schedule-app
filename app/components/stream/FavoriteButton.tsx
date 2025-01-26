'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoriteContext';
import type { Channel } from '../../types';

type Props = {
  channel: Channel;
};

export function FavoriteButton({ channel }: Props) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(channel.id);

  return (
    <button
      className="group rounded-full p-2 hover:bg-red-200 transition-colors isolate"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(channel);
      }}
    >
      <Heart
        className={`w-5 h-5 ${
          favorite 
            ? 'fill-red-500 text-red-500 dark:fill-red-500 dark:text-red-500' 
            : 'text-black/50 hover:text-red-500 dark:text-white group-hover:text-red-500'
        }`}
      />
    </button>
  );
}
