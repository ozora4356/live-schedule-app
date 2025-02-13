import { Skeleton } from '@/components/ui/skeleton';

export function CardSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="overflow-hidden">
          <div className="flex flex-col relative h-full">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="flex items-start gap-3 my-2">
              <Skeleton className="sm:block hidden rounded-full flex-shrink-0 w-10 h-10" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-1">
                  <Skeleton className="h-3 w-24 mt-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
