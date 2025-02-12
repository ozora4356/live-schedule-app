import Image from 'next/image';
import type { LiveStream } from '../../types';
import { FavoriteButton } from './FavoriteButton';

type Props = {
  streams: LiveStream[];
};

export function LiveStreamCard({ streams }: Props) {
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {streams.map((stream) => (
          <div key={stream.id} className="overflow-hidden">
            <div className="flex flex-col relative h-full">
              <a
                href={`https://www.youtube.com/watch?v=${stream.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <Image
                    src={stream.thumbnail}
                    alt={stream.title}
                    width={480}
                    height={270}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-start gap-3 my-2">
                  <Image
                    src={stream.channel.photo}
                    alt={stream.channel.name}
                    width={40}
                    height={40}
                    className="hidden sm:block rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-base line-clamp-2 can-hover:group-hover:text-blue-600 dark:can-hover:group-hover:text-blue-400 transition-colors">
                      {stream.title}
                    </h3>
                    <div className="flex items-end justify-between pr-8 sm:pr-0">
                      <div className="mt-1">
                        <p className="text-sm line-clamp-1 text-gray-600 dark:text-gray-300">
                          {stream.streamer}
                        </p>
                        <div className="sm:flex sm:items-center mt-1 text-sm gap-1">
                          <span className="text-stream-red font-bold block sm:inline">
                            配信中
                          </span>
                          <span className="text-gray-600 block">
                            {stream.isMemberOnly ? (
                              <span className="text-blue-500 font-bold">
                                メンバーシップ配信
                              </span>
                            ) : (
                              <p>
                                {(stream.viewers ?? 0).toLocaleString()}
                                人の視聴者
                              </p>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
              <div className="absolute right-0 bottom-0">
                <FavoriteButton channel={stream.channel} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
