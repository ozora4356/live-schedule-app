import type { LiveStream, Schedule, Organization } from '../../types';

export interface StreamData {
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
    // サーバーサイドのAPIルートを使用
    const response = await fetch(`/api/streams?org=${org}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('API Status:', response.status);
      console.error('API Status Text:', response.statusText);
      return [];
    }

    const streams = await response.json();
    return streams;
  } catch (error) {
    console.error('Error fetching streams:', error);
    return [];
  }
}

export async function getSchedules(org: Organization): Promise<Schedule[]> {
  try {
    // 新しいAPIエンドポイントを作成して使用
    const response = await fetch(`/api/schedules?org=${org}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('API Status:', response.status);
      console.error('API Status Text:', response.statusText);
      return [];
    }

    const schedules = await response.json();
    return schedules;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
}
