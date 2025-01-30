export type Channel = {
  id: string;
  name: string;
  photo: string;
  channelUrl: string;
  org?: string;
  english_name?: string;
  type?: string;
};

export type HoloData = {
  available_at: string;
  channel: Channel;
  duration: number;
  id: string;
  live_viewers: number;
  published_at: string;
  start_actual: string;
  start_scheduled: string;
  status: 'live' | 'upcoming' | 'memberOnly';
  title: string;
  topic_id: string;
  type: string;
};

export interface LiveStream {
  id: string;
  title: string;
  streamer: string;
  thumbnail: string;
  viewers?: number;
  startedAt: Date;
  channel: {
    id: string;
    name: string;
    photo: string;
    channelUrl: string;
    org?: string;
  };
  isMemberOnly: boolean;
  mentions?: Array<{ org: string }>;
}

export type Schedule = {
  id: string;
  title: string;
  streamer: string;
  scheduledAt: Date;
  thumbnail: string;
  channel: Channel;
  type: 'stream' | 'video';
};

export type Organization = 'Nijisanji' | 'Hololive' | 'Vspo';
