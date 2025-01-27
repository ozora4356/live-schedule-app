'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { LiveStream } from '../types';
import { getLiveStreams } from '../lib/api/streams';
import { useOrg } from '../contexts/OrgContext';

type LiveStreamContextType = {
  liveStreams: LiveStream[];
  setLiveStreams: (streams: LiveStream[]) => void;
};

const LiveStreamContext = createContext<LiveStreamContextType | undefined>(
  undefined,
);

export function LiveStreamProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedOrg } = useOrg();
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);

  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        const streams = await getLiveStreams(selectedOrg);

        // 配列チェックを追加
        const streamsArray = Array.isArray(streams) ? streams : [];

        // 空の配列の場合は早期リターン
        if (streamsArray.length === 0) {
          setLiveStreams([]);
          return;
        }

        const filteredStreams = streamsArray.filter(
          (stream) => stream.channel.org === selectedOrg,
        );

        setLiveStreams(filteredStreams);
      } catch (error) {
        console.error('Error fetching live streams:', error);
        setLiveStreams([]);
      }
    };

    fetchLiveStreams();
  }, [selectedOrg]);

  return (
    <LiveStreamContext.Provider value={{ liveStreams, setLiveStreams }}>
      {children}
    </LiveStreamContext.Provider>
  );
}

export function useLiveStreams() {
  const context = useContext(LiveStreamContext);
  if (!context) {
    throw new Error('useLiveStreams must be used within a LiveStreamProvider');
  }
  return context;
}

// すべての配信を取得するカスタムフック
export function useLiveStreamsAll() {
  const [allLiveStreams, setAllLiveStreams] = useState<LiveStream[]>([]);

  useEffect(() => {
    const fetchAllStreams = async () => {
      try {
        const [hololiveStreams, nijisanjiStreams] = await Promise.all([
          getLiveStreams('Hololive'),
          getLiveStreams('Nijisanji'),
        ]);

        // 配列チェックを追加
        const hololiveArray = Array.isArray(hololiveStreams)
          ? hololiveStreams
          : [];
        const nijisanjiArray = Array.isArray(nijisanjiStreams)
          ? nijisanjiStreams
          : [];

        const filteredHololive = hololiveArray.filter(
          (stream) => stream.channel.org === 'Hololive',
        );
        const filteredNijisanji = nijisanjiArray.filter(
          (stream) => stream.channel.org === 'Nijisanji',
        );

        setAllLiveStreams([...filteredHololive, ...filteredNijisanji]);
      } catch (error) {
        console.error('Error fetching all streams:', error);
      }
    };

    fetchAllStreams();
  }, []);

  return allLiveStreams;
}
