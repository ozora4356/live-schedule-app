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
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold mb-1">お気に入りチャンネル</h2>
        {liveChannels.length > 0 && (
          <>
            <div className="mt-8">
              <h3 className="text-base font-semibold mb-2">配信中</h3>
              {liveChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex gap-2 items-center justify-between"
                >
                  <a
                    href={channel.channelUrl}
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
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
                    </div>
                    <div className="overflow-hidden flex-1 min-w-0">
                      <p className="font-medium truncate">{channel.name}</p>
                    </div>
                  </a>
                  <FavoriteButton channel={channel} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div>
        <h3 className="text-base font-semibold mb-1">オフライン</h3>
        {offlineChannels.length > 0 && (
          <>
            <div>
              {offlineChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex gap-2 items-center justify-between"
                >
                  <a
                    href={channel.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 flex-1 min-w-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg"
                  >
                    <Image
                      src={channel.photo}
                      alt={channel.name}
                      width={30}
                      height={30}
                      className="rounded-full flex-shrink-0"
                    />
                    <div className="overflow-hidden flex-1 min-w-0">
                      <p className="font-medium truncate text-gray-400">
                        {channel.name}
                      </p>
                    </div>
                  </a>
                  <FavoriteButton channel={channel} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
