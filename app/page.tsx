'use client';

import LiveStreamListContainer from './components/stream/LiveStreamList';
import ScheduleListContainer from './components/stream/ScheduleList';

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <LiveStreamListContainer />
      <ScheduleListContainer />
    </div>
  );
}
