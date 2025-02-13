'use client';

import { getLiveStreams } from '../../lib/api/streams';
import { LiveStreamCard } from './LiveStreamCard';
import { CardSkeleton } from '../ui/CardSkelton';
import { useOrg } from '../../contexts/OrgContext';
import { useSortOrder } from '../../contexts/SortContext';
import { useEffect, useState, useMemo } from 'react';
import type { LiveStream } from '../../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LiveStreamList() {
  const { selectedOrg } = useOrg();
  const { sortOrder, setSortOrder } = useSortOrder();
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getLiveStreams(selectedOrg)
      .then((data) => {
        setStreams(data);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [selectedOrg]);

  const sortStreams = (streams: LiveStream[]) => {
    return [...streams].sort((a, b) => {
      const viewersA = a.viewers ?? 0;
      const viewersB = b.viewers ?? 0;
      return sortOrder === 'desc' ? viewersB - viewersA : viewersA - viewersB;
    });
  };

  const membershipStreams = useMemo(() => {
    return streams.filter((stream) => stream.isMemberOnly === true);
  }, [streams]);

  const publicStreams = streams.filter(
    (stream) => !membershipStreams.some((ms) => ms.id === stream.id)
  );
  const sortedPublicStreams = sortStreams(publicStreams);
  const sortedMemberStreams = sortStreams(membershipStreams);

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
        <p className="text-red-700 dark:text-red-300">
          配信情報の取得に失敗しました。しばらく経ってから再度お試しください。
        </p>
      </div>
    );
  }

  if (isLoading) {
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
          <CardSkeleton />
        </section>
      </div>
    );
  }

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
