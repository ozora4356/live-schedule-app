import type { LiveStream, Schedule, Organization } from '../../types';

export async function getLiveStreams(org: Organization): Promise<LiveStream[]> {
  try {
    const res = await fetch(`/api/streams?org=${org}&type=live`);
    if (!res.ok) {
      throw new Error('Failed to fetch live streams');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching live streams:', error);
    throw error;
  }
}

export async function getSchedules(org: Organization): Promise<Schedule[]> {
  try {
    const res = await fetch(`/api/streams?org=${org}&type=schedule`);
    if (!res.ok) {
      throw new Error('Failed to fetch schedules');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
}
