'use client';

import { Suspense } from 'react';
import { getLiveStreams } from '../../lib/api/streams';
import { LiveStreamContent } from './LiveStreamContent';
import LoadingSpinner from './LoadingSpinner';
import { useOrg } from '../../contexts/OrgContext';
import { useEffect, useState } from 'react';
import type { LiveStream } from '../../types';
import { useLiveStreams } from '../../contexts/LiveStreamContext';

export default function LiveStreamListContainer() {
  const { selectedOrg } = useOrg();
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [error, setError] = useState(false);
  const { setLiveStreams } = useLiveStreams();

  useEffect(() => {
    getLiveStreams(selectedOrg)
      .then((data) => {
        setStreams(data);
        setLiveStreams(data);
      })
      .catch(() => setError(true));
  }, [selectedOrg, setLiveStreams]);

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
        <p className="text-red-700 dark:text-red-300">
          配信情報の取得に失敗しました。しばらく経ってから再度お試しください。
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LiveStreamContent streams={streams} />
    </Suspense>
  );
}
