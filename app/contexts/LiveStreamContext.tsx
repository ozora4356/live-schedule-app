'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { LiveStream } from '../types';
import { getLiveStreams } from '../lib/api/streams';
import { useOrg } from '../contexts/OrgContext';

interface LiveStreamContextType {
  liveStreams: LiveStream[];
  setLiveStreams: (streams: LiveStream[]) => void;
}

const LiveStreamContext = createContext<LiveStreamContextType | undefined>(
  undefined
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
        if (selectedOrg === 'All') {
          // Allの場合、両方の組織の配信を取得して結合
          const [
            hololiveStreams,
            nijisanjiStreams,
            vspoStreams,
            neoPorteStreams,
          ] = await Promise.all([
            getLiveStreams('Hololive'),
            getLiveStreams('Nijisanji'),
            getLiveStreams('VSpo'),
            getLiveStreams('Neo-Porte'),
          ]);
          setLiveStreams([
            ...hololiveStreams,
            ...nijisanjiStreams,
            ...vspoStreams,
            ...neoPorteStreams,
          ]);
        } else {
          const streams = await getLiveStreams(selectedOrg);
          setLiveStreams(streams);
        }
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

export function useLiveStreamContext() {
  const context = useContext(LiveStreamContext);
  if (context === undefined) {
    throw new Error(
      'useLiveStreamContext must be used within a LiveStreamProvider'
    );
  }
  return context;
}

// すべての配信を取得するカスタムフック
export function useLiveStreamsAll() {
  const [allLiveStreams, setAllLiveStreams] = useState<LiveStream[]>([]);

  useEffect(() => {
    const fetchAllStreams = async () => {
      try {
        const [
          hololiveStreams,
          nijisanjiStreams,
          vspoStreams,
          neoPorteStreams,
        ] = await Promise.all([
          getLiveStreams('Hololive'),
          getLiveStreams('Nijisanji'),
          getLiveStreams('VSpo'),
          getLiveStreams('Neo-Porte'),
        ]);

        // 配列チェックを追加
        const hololiveArray = Array.isArray(hololiveStreams)
          ? hololiveStreams
          : [];
        const nijisanjiArray = Array.isArray(nijisanjiStreams)
          ? nijisanjiStreams
          : [];
        const vspoArray = Array.isArray(vspoStreams) ? vspoStreams : [];
        const neoPorteArray = Array.isArray(neoPorteStreams)
          ? neoPorteStreams
          : [];

        // 各組織の配信をフィルタリング
        const filteredHololive = hololiveArray.filter(
          (stream) => stream.channel.org === 'Hololive'
        );
        const filteredNijisanji = nijisanjiArray.filter(
          (stream) => stream.channel.org === 'Nijisanji'
        );
        const filteredVSpo = vspoArray.filter(
          (stream) => stream.channel.org === 'VSpo'
        );
        const filteredNeoPorte = neoPorteArray.filter(
          (stream) => stream.channel.org === 'Neo-Porte'
        );

        setAllLiveStreams([
          ...filteredHololive,
          ...filteredNijisanji,
          ...filteredVSpo,
          ...filteredNeoPorte,
        ]);
      } catch (error) {
        console.error('Error fetching all streams:', error);
      }
    };

    fetchAllStreams();
  }, []);

  return allLiveStreams;
}
