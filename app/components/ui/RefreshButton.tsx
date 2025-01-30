'use client';

import { Button } from '../../../components/ui/button';
import { RotateCw } from 'lucide-react';
import { useState } from 'react';
import { useOrg } from '@/app/contexts/OrgContext';
import { useLiveStreamContext } from '@/app/contexts/LiveStreamContext';
import { getLiveStreams } from '@/app/lib/api/streams';

export function RefreshButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedOrg } = useOrg();
  const { setLiveStreams } = useLiveStreamContext();

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const streams = await getLiveStreams(selectedOrg);
      setLiveStreams(streams);
    } catch (error) {
      console.error('Failed to refresh streams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRefresh}
      disabled={isLoading}
      className="hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <RotateCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
      <span className="sr-only">更新</span>
    </Button>
  );
} 