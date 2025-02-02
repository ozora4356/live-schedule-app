import { NextResponse } from 'next/server';
import type { Organization } from '@/app/types';
import type { StreamData } from '@/app/lib/api/streams';

export async function GET(request: Request) {
  const apiKey = process.env.VTUBER_API_KEY;
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
      `https://holodex.net/api/v2/live?status=upcoming&org=${org}`,
      {
        headers: {
          Accept: 'application/json',
          'X-APIKEY': apiKey,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const schedules = data.map((item: StreamData) => ({
      id: item.id,
      title: item.title,
      streamer: item.channel.name,
      scheduledAt: item.start_scheduled
        ? new Date(item.start_scheduled)
        : new Date(),
      thumbnail: `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
      channel: {
        id: item.channel.id,
        name: item.channel.name,
        photo: item.channel.photo,
        channelUrl: `https://www.youtube.com/channel/${item.channel.id}`,
        org: item.channel.org,
      },
    }));

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 },
    );
  }
}
