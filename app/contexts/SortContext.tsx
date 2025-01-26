'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type SortOrder = 'desc' | 'asc';

type SortContextType = {
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
};

const SortContext = createContext<SortContextType | undefined>(undefined);

export function SortProvider({ children }: { children: ReactNode }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  return (
    <SortContext.Provider value={{ sortOrder, setSortOrder }}>
      {children}
    </SortContext.Provider>
  );
}

export function useSortOrder() {
  const context = useContext(SortContext);
  if (context === undefined) {
    throw new Error('useSortOrder must be used within a SortProvider');
  }
  return context;
}
