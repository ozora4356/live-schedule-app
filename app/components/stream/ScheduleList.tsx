'use client';

import { getSchedules } from '../../lib/api/streams';
import { ScheduleCard } from './ScheduleCard';
import { useOrg } from '../../contexts/OrgContext';
import { useEffect, useState } from 'react';
import type { Schedule } from '../../types';

export default function ScheduleList() {
  const { selectedOrg } = useOrg();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getSchedules(selectedOrg)
      .then((data) => {
        setSchedules(data);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
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

  return <ScheduleCard schedules={schedules} isLoading={isLoading} />;
}
