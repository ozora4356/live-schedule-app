import { NextResponse } from 'next/server';
import type { Organization } from '@/app/types';
import type { StreamData } from '@/app/lib/api/streams';

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
        fetch('https://holodex.net/api/v2/live?status=upcoming&org=Hololive', {
          headers: {
            Accept: 'application/json',
            'X-APIKEY': apiKey,
          },
          cache: 'no-store',
        }),
        fetch('https://holodex.net/api/v2/live?status=upcoming&org=Nijisanji', {
          headers: {
            Accept: 'application/json',
            'X-APIKEY': apiKey,
          },
          cache: 'no-store',
        }),
        fetch('https://holodex.net/api/v2/live?status=upcoming&org=VSpo', {
          headers: {
            Accept: 'application/json',
            'X-APIKEY': apiKey,
          },
          cache: 'no-store',
        }),
        fetch('https://holodex.net/api/v2/live?status=upcoming&org=Neo-Porte', {
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
      const scheduleMap = new Map();

      // 両方のデータを結合し、IDをキーとして重複を防ぐ
      [...hololiveData, ...nijisanjiData, ...vspoData, ...neoPorteData].forEach(
        (item: StreamData) => {
          scheduleMap.set(item.id, {
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
          });
        }
      );

      // Map の値を配列に変換
      const schedules = Array.from(scheduleMap.values());
      return NextResponse.json(schedules);
    }

    // 特定の組織の配信予定を取得
    const response = await fetch(
      `https://holodex.net/api/v2/live?status=upcoming&org=${org}`,
      {
        headers: {
          Accept: 'application/json',
          'X-APIKEY': apiKey,
        },
        cache: 'no-store',
      }
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
      { status: 500 }
    );
  }
}
