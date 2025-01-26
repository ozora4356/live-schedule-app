'use client';

import { createContext, useContext, useState } from 'react';
import type { Schedule } from '../types';

type ScheduleContextType = {
  schedules: Schedule[];
  setSchedules: (schedules: Schedule[]) => void;
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined,
);

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  return (
    <ScheduleContext.Provider value={{ schedules, setSchedules }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedules() {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedules must be used within a ScheduleProvider');
  }
  return context;
}
