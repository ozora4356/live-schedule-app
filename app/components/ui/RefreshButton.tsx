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
      // すべての組織の配信を取得
      const [hololiveStreams, nijisanjiStreams, vspoStreams, neoPorteStreams] =
        await Promise.all([
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

      // 選択されている組織に応じて表示する配信を設定
      if (selectedOrg === 'All') {
        setLiveStreams([
          ...filteredHololive,
          ...filteredNijisanji,
          ...filteredVSpo,
          ...filteredNeoPorte,
        ]);
      } else {
        const orgStreams =
          {
            Hololive: filteredHololive,
            Nijisanji: filteredNijisanji,
            VSpo: filteredVSpo,
            'Neo-Porte': filteredNeoPorte,
          }[selectedOrg] || [];
        setLiveStreams(orgStreams);
      }

      // ページをリロード
      window.location.reload();
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
