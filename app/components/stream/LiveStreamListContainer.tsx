'use client';

import { getLiveStreams } from '../../lib/api/streams';
import { LiveStreamContent } from './LiveStreamContent';
import { useOrg } from '../../contexts/OrgContext';
import { useEffect, useState, useMemo } from 'react';
import type { LiveStream } from '../../types';

export default function LiveStreamListContainer() {
  const { selectedOrg } = useOrg();
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

  const membershipStreams = useMemo(() => {
    return streams.filter((stream) => stream.isMemberOnly === true);
  }, [streams]);

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
    <LiveStreamContent
      streams={streams}
      membershipStreams={membershipStreams}
      isLoading={isLoading}
    />
  );
}
