import { Skeleton } from '@/components/ui/skeleton';

export function ScheduleCardSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="overflow-hidden">
          <div className="flex flex-col relative h-full">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="flex items-start gap-3 my-2">
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
