'use client';

import { Suspense } from 'react';
import { getSchedules } from '../../lib/api/streams';
import { ScheduleCard } from './ScheduleCard';
import LoadingSpinner from './LoadingSpinner';
import { useOrg } from '../../contexts/OrgContext';
import { useEffect, useState } from 'react';
import type { Schedule } from '../../types';

export default function ScheduleListContainer() {
  const { selectedOrg } = useOrg();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    getSchedules(selectedOrg)
      .then(setSchedules)
      .catch(() => setError(true));
  }, [selectedOrg]);

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
        <p className="text-red-700 dark:text-red-300">
          配信予定の取得に失敗しました。しばらく経ってから再度お試しください。
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ScheduleCard schedules={schedules} />
    </Suspense>
  );
}
