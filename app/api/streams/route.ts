import { NextResponse } from 'next/server';

interface Channel {
  id: string;
  name: string;
  photo: string;
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
  const org = searchParams.get('org');
  const type = searchParams.get('type');

  if (!apiKey || !org) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `https://holodex.net/api/v2/live?${
        type === 'live' ? 'status=live' : 'status=upcoming'
      }&org=${org}`,
      {
        headers: {
          Accept: 'application/json',
          'X-APIKEY': apiKey,
        },
      },
    );

    if (!res.ok) {
      throw new Error('API request failed');
    }

    const data = await res.json();

    // フィルタリングとマッピング
    const filteredData = data
      .filter((item: StreamData) => !shouldFilterStream(item))
      .map((item: StreamData) =>
        type === 'live'
          ? {
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
            }
          : {
              id: item.id,
              title: item.title,
              streamer: item.channel.name,
              scheduledAt: item.start_scheduled
                ? new Date(item.start_scheduled)
                : new Date(),
              thumbnail: `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
              channel: mapChannelData(item.channel),
            },
      );

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('API error:', error);
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
  };
}

function shouldFilterStream(stream: StreamData) {
  const keywords = [
    'フリーチャット',
    '待機所',
    'waiting room',
    '待機枠',
    'FREE CHAT',
    'freechat',
  ];

  const isNonHololive = !stream.channel.id.startsWith('UC');

  return (
    keywords.some((keyword) =>
      stream.title.toLowerCase().includes(keyword.toLowerCase()),
    ) || isNonHololive
  );
}
