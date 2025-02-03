import { NextResponse } from 'next/server';
import type { Organization } from '@/app/types';

interface Channel {
  id: string;
  name: string;
  photo: string;
  org?: string;
}

interface StreamData {
  id: string;
  title: string;
  channel: Channel;
  status?: string;
  topic_id?: string;
  live_viewers?: number;
  start_actual?: string;
  start_scheduled?: string;
  org?: string;
  mentions?: { org?: string }[];
}

export async function GET(request: Request) {
  const apiKey = process.env.VTUBER_API_KEY;
  const { searchParams } = new URL(request.url);
  const org = searchParams.get('org') as Organization;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 400 });
  }

  try {
    if (org === 'All') {
      const [
        hololiveResponse,
        nijisanjiResponse,
        vspoResponse,
        neoPorteResponse,
      ] = await Promise.all([
        fetch('https://holodex.net/api/v2/live?status=live&org=Hololive', {
          headers: {
            Accept: 'application/json',
            'X-APIKEY': apiKey,
          },
          cache: 'no-store',
        }),
        fetch('https://holodex.net/api/v2/live?status=live&org=Nijisanji', {
          headers: {
            Accept: 'application/json',
            'X-APIKEY': apiKey,
          },
          cache: 'no-store',
        }),
        fetch('https://holodex.net/api/v2/live?status=live&org=VSpo', {
          headers: {
            Accept: 'application/json',
            'X-APIKEY': apiKey,
          },
          cache: 'no-store',
        }),
        fetch('https://holodex.net/api/v2/live?status=live&org=Neo-Porte', {
          headers: {
            Accept: 'application/json',
            'X-APIKEY': apiKey,
          },
          cache: 'no-store',
        }),
      ]);

      if (
        !hololiveResponse.ok ||
        !nijisanjiResponse.ok ||
        !vspoResponse.ok ||
        !neoPorteResponse.ok
      ) {
        throw new Error('API Error');
      }

      const [hololiveData, nijisanjiData, vspoData, neoPorteData] =
        await Promise.all([
          hololiveResponse.json(),
          nijisanjiResponse.json(),
          vspoResponse.json(),
          neoPorteResponse.json(),
        ]);

      // 重複を除去するために、Map を使用
      const streamMap = new Map();

      // すべてのデータを結合し、IDをキーとして重複を防ぐ
      [...hololiveData, ...nijisanjiData, ...vspoData, ...neoPorteData].forEach(
        (item: StreamData) => {
          if (!shouldFilterStream(item, org)) {
            streamMap.set(item.id, {
              id: item.id,
              title: item.title,
              streamer: item.channel.name,
              thumbnail: `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
              viewers: item.live_viewers,
              startedAt: item.start_actual
                ? new Date(item.start_actual)
                : new Date(),
              channel: mapChannelData(item.channel),
              isMemberOnly:
                item.status === 'memberOnly' || item.topic_id === 'membersonly',
              org: item.channel.org,
            });
          }
        }
      );

      const filteredData = Array.from(streamMap.values());
      return NextResponse.json(filteredData);
    }

    // 特定の組織の配信を取得
    const response = await fetch(
      `https://holodex.net/api/v2/live?status=live&org=${org}`,
      {
        headers: {
          Accept: 'application/json',
          'X-APIKEY': apiKey,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error('API Status:', response.status);
      console.error('API Status Text:', response.statusText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // フィルタリングとマッピング
    const filteredData = data
      .filter((item: StreamData) => !shouldFilterStream(item, org))
      .map((item: StreamData) => ({
        id: item.id,
        title: item.title,
        streamer: item.channel.name,
        thumbnail: `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
        viewers: item.live_viewers,
        startedAt: item.start_actual ? new Date(item.start_actual) : new Date(),
        channel: mapChannelData(item.channel),
        isMemberOnly:
          item.status === 'memberOnly' || item.topic_id === 'membersonly',
        org: item.channel.org,
      }));

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Error fetching live streams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

function mapChannelData(channel: Channel) {
  return {
    id: channel.id,
    name: channel.name,
    photo: channel.photo,
    channelUrl: `https://www.youtube.com/channel/${channel.id}`,
    org: channel.org,
  };
}

function shouldFilterStream(item: StreamData, selectedOrg: Organization) {
  // 選択された組織と配信者の所属組織が一致するかチェック
  // Allの場合は全ての組織を許可
  const isWrongOrg = selectedOrg !== 'All' && item.channel.org !== selectedOrg;
  const keywords = [
    'フリーチャット',
    '待機所',
    'waiting room',
    '待機枠',
    'free chat',
    'schedule',
    '予定',
    '配信予定',
    'upcoming',
  ];

  const normalizedTitle = item.title.toLowerCase();
  const isWaitingRoom = keywords.some((keyword) =>
    normalizedTitle.includes(keyword.toLowerCase())
  );

  const isZeroViewers =
    (!item.live_viewers || item.live_viewers === 0) &&
    item.status !== 'memberOnly' &&
    item.topic_id !== 'membersonly';

  const isNotLive = item.status !== 'live';

  const now = new Date();
  const scheduledTime = item.start_scheduled
    ? new Date(item.start_scheduled)
    : null;
  const isOverdue = scheduledTime && now > scheduledTime && !item.start_actual;

  // コラボ配信のフィルタリング
  const hasDifferentOrgMentions =
    item.mentions?.some(
      (mention) => mention.org && mention.org !== item.channel.org
    ) ?? false;

  return (
    isWrongOrg ||
    isWaitingRoom ||
    isZeroViewers ||
    isNotLive ||
    isOverdue ||
    hasDifferentOrgMentions
  );
}
