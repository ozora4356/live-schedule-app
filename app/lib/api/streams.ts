import type { LiveStream, Schedule, Organization } from '../../types';

interface StreamData {
  id: string;
  title: string;
  channel: {
    id: string;
    name: string;
    photo: string;
    org?: string;
  };
  live_viewers?: number;
  start_actual?: string;
  start_scheduled?: string;
  status?: string;
  topic_id?: string;
}

export async function getLiveStreams(org: Organization): Promise<LiveStream[]> {
  try {
    const response = await fetch(
      `https://holodex.net/api/v2/live?status=live&org=${org}`,
      {
        headers: {
          Accept: 'application/json',
          'X-APIKEY': process.env.NEXT_PUBLIC_VTUBER_API_KEY || '',
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      console.error('API Status:', response.status);
      console.error('API Status Text:', response.statusText);
      return [];
    }

    const data = await response.json();

    // フィルタリングとマッピング
    return data
      .filter((item: StreamData) => item.channel.org === org)
      .map((item: StreamData) => ({
        id: item.id,
        title: item.title,
        streamer: item.channel.name,
        thumbnail: `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
        viewers: item.live_viewers,
        startedAt: item.start_actual ? new Date(item.start_actual) : new Date(),
        channel: {
          id: item.channel.id,
          name: item.channel.name,
          photo: item.channel.photo,
          channelUrl: `https://www.youtube.com/channel/${item.channel.id}`,
          org: item.channel.org,
        },
        isMemberOnly:
          item.status === 'memberOnly' || item.topic_id === 'membersonly',
      }));
  } catch (error) {
    console.error('Error fetching streams:', error);
    return [];
  }
}

export async function getSchedules(org: Organization): Promise<Schedule[]> {
  try {
    const response = await fetch(
      `https://holodex.net/api/v2/live?status=upcoming&org=${org}`,
      {
        headers: {
          Accept: 'application/json',
          'X-APIKEY': process.env.NEXT_PUBLIC_VTUBER_API_KEY || '',
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      console.error('API Status:', response.status);
      console.error('API Status Text:', response.statusText);
      return [];
    }

    const data = await response.json();

    // フィルタリングとマッピング
    return data
      .filter((item: StreamData) => item.channel.org === org)
      .map((item: StreamData) => ({
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
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
}
