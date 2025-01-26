'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { LiveStream } from '../types';
import { getLiveStreams } from '../lib/api/streams';

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
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);

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
    // Hololiveの配信を取得
    const fetchHololive = getLiveStreams('Hololive');
    // Nijisanjiの配信を取得
    const fetchNijisanji = getLiveStreams('Nijisanji');

    Promise.all([fetchHololive, fetchNijisanji])
      .then(([hololiveStreams, nijisanjiStreams]) => {
        setAllLiveStreams([...hololiveStreams, ...nijisanjiStreams]);
      })
      .catch((error) => {
        console.error('Error fetching all streams:', error);
      });
  }, []);

  return allLiveStreams;
}
