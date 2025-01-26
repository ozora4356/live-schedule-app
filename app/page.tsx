'use client';

import LiveStreamListContainer from './components/stream/LiveStreamListContainer';
import ScheduleListContainer from './components/stream/ScheduleListContainer';

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <LiveStreamListContainer />
      <ScheduleListContainer />
    </div>
  );
}
