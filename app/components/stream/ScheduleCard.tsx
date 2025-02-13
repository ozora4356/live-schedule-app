import Image from 'next/image';
import type { Schedule } from '../../types';
import { FavoriteButton } from './FavoriteButton';
import { CardSkeleton } from '../ui/CardSkelton';

type Props = {
  schedules: Schedule[];
  isLoading: boolean;
};

function formatScheduleTime(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${month}/${day} ${hour}:${minute}~`;
}

export function ScheduleCard({ schedules, isLoading }: Props) {
  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">配信予定</h2>
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div>
      <section>
        <h2 className="text-2xl font-bold mb-4">配信予定</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="overflow-hidden">
              <div className="flex flex-col relative h-full">
                <a
                  href={`https://www.youtube.com/watch?v=${schedule.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl">
                    <Image
                      src={schedule.thumbnail}
                      alt={schedule.title}
                      width={480}
                      height={270}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-start gap-3 my-2">
                    <Image
                      src={schedule.channel.photo}
                      alt={schedule.channel.name}
                      width={40}
                      height={40}
                      className="hidden sm:block rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-base line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {schedule.title}
                      </h3>
                      <div className="mt-1 pr-8 sm:pr-0">
                        <p className="text-sm line-clamp-1 text-gray-600 dark:text-gray-300">
                          {schedule.streamer}
                        </p>
                        <p className="text-sm text-blue-500 font-bold mt-1">
                          {formatScheduleTime(new Date(schedule.scheduledAt))}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
                <div className="absolute right-0 bottom-0">
                  <FavoriteButton channel={schedule.channel} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
