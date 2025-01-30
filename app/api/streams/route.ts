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
}

export async function GET(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_VTUBER_API_KEY;
  const { searchParams } = new URL(request.url);
  const org = searchParams.get('org') as Organization;

  if (!apiKey || !org) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://holodex.net/api/v2/live?status=live&org=${org}`,
      {
        headers: {
          Accept: 'application/json',
          'X-APIKEY': apiKey,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      console.error('API Status:', response.status);
      console.error('API Status Text:', response.statusText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // フィルタリングとマッピング
    const filteredData = data
      .filter((item: StreamData) => {
        const shouldFilter = shouldFilterStream(item);
        return !shouldFilter;
      })
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
        org: item.org,
      }));

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Error fetching live streams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 },
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

function shouldFilterStream(stream: StreamData) {
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

  // タイトルを小文字に変換して、キーワードが含まれているかをチェック
  const normalizedTitle = stream.title.toLowerCase();
  const isWaitingRoom = keywords.some((keyword) =>
    normalizedTitle.includes(keyword.toLowerCase()),
  );

  // 組織によるフィルタリング
  const isCorrectOrg = stream.channel.org === stream.org;

  // 視聴者数が0またはundefinedの通常配信をフィルタリング（メンバーシップ配信は除外）
  const isZeroViewers =
    (!stream.live_viewers || stream.live_viewers === 0) &&
    stream.status !== 'memberOnly' &&
    stream.topic_id !== 'membersonly';

  // 配信が実際に開始されているかチェック
  const isNotLive = stream.status !== 'live';

  // 予定時間を過ぎても開始していない配信をフィルタリング
  const now = new Date();
  const scheduledTime = stream.start_scheduled
    ? new Date(stream.start_scheduled)
    : null;
  const isOverdue =
    scheduledTime && now > scheduledTime && !stream.start_actual;

  return (
    isWaitingRoom || !isCorrectOrg || isZeroViewers || isNotLive || isOverdue
  );
}
