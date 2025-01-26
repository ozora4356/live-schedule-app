export type Channel = {
  english_name: string;
  id: string;
  name: string;
  org?: 'Hololive' | 'Nijisanji';
  photo: string;
  type: string;
  channelUrl: string;
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

export type LiveStream = {
  id: string;
  title: string;
  streamer: string;
  thumbnail: string;
  viewers: number;
  startedAt: Date;
  channel: Channel;
  isMemberOnly: boolean;
};

export type Schedule = {
  id: string;
  title: string;
  streamer: string;
  scheduledAt: Date;
  thumbnail: string;
  channel: Channel;
  type: 'stream' | 'video';
};

export type Organization = 'Hololive' | 'Nijisanji';
