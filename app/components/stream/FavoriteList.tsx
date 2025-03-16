'use client';

import Image from 'next/image';
import { useFavorites } from '@/app/contexts/FavoriteContext';
import { FavoriteButton } from './FavoriteButton';
import { useLiveStreamsAll } from '@/app/contexts/LiveStreamContext';

export function FavoriteList() {
  const { favorites } = useFavorites();
  const allLiveStreams = useLiveStreamsAll();

  // ライブ配信中のお気に入りチャンネル
  const liveChannels = favorites.filter((favorite) =>
    allLiveStreams.some((stream) => stream.channel.id === favorite.id)
  );

  // 非ライブ配信のお気に入りチャンネル
  const offlineChannels = favorites.filter(
    (favorite) =>
      !allLiveStreams.some((stream) => stream.channel.id === favorite.id)
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          ライブ配信中
        </h3>
        {liveChannels.length > 0 && (
          <div className="space-y-1">
            {liveChannels.map((channel) => {
              const liveStream = allLiveStreams.find(
                (stream) => stream.channel.id === channel.id
              );

              return (
                <div
                  key={channel.id}
                  className="flex gap-2 items-center justify-between"
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${liveStream?.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 flex-1 min-w-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg"
                  >
                    <div className="relative">
                      <Image
                        src={channel.photo}
                        alt={channel.name}
                        width={30}
                        height={30}
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
                    </div>
                    <div className="overflow-hidden flex-1 min-w-0">
                      <p className="font-medium truncate">{channel.name}</p>
                    </div>
                  </a>
                  <FavoriteButton channel={channel} />
                </div>
              );
            })}
          </div>
        )}
        {liveChannels.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            配信中のチャンネルはありません
          </p>
        )}
      </div>

      <div className="mt-2">
        <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          フォロー中
        </h3>
        {offlineChannels.length > 0 && (
          <div className="space-y-1">
            {offlineChannels.map((channel) => (
              <div
                key={channel.id}
                className="flex gap-2 items-center justify-between group"
              >
                <a
                  href={channel.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 flex-1 min-w-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg"
                >
                  <Image
                    src={channel.photo}
                    alt={channel.name}
                    width={30}
                    height={30}
                    className="rounded-full flex-shrink-0 grayscale group-hover:grayscale-0 transition-all"
                  />
                  <div className="overflow-hidden flex-1 min-w-0">
                    <p className="font-medium truncate text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                      {channel.name}
                    </p>
                  </div>
                </a>
                <FavoriteButton channel={channel} />
              </div>
            ))}
          </div>
        )}
        {offlineChannels.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            フォロー中のチャンネルはありません
          </p>
        )}
      </div>
    </div>
  );
}
