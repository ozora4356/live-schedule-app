'use client';

import { useSortOrder } from '../../contexts/SortContext';
import { LiveStreamCard } from './LiveStreamCard';
import type { LiveStream } from '../../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

export function LiveStreamContent({ streams }: { streams: LiveStream[] }) {
  const { sortOrder, setSortOrder } = useSortOrder();

  const memberOnlyStreams = streams.filter((stream) => stream.isMemberOnly);
  const publicStreams = streams.filter((stream) => !stream.isMemberOnly);

  const sortStreams = (streams: LiveStream[]) => {
    return [...streams].sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.viewers - a.viewers;
      }
      return a.viewers - b.viewers;
    });
  };

  const sortedPublicStreams = sortStreams(publicStreams);
  const sortedMemberStreams = sortStreams(memberOnlyStreams);

  return (
    <div>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">配信中</h2>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  sortOrder === 'desc' ? '視聴者数 (降順)' : '視聴者数 (昇順)'
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">視聴者数 （降順）</SelectItem>
              <SelectItem value="asc">視聴者数 （昇順）</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <LiveStreamCard streams={sortedPublicStreams} />
      </section>

      {sortedMemberStreams.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4">メンバーシップ配信</h2>
          <LiveStreamCard streams={sortedMemberStreams} />
        </section>
      )}
    </div>
  );
}
