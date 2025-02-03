'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { Organization } from '../types';
import type { ReactNode } from 'react';

interface OrgContextType {
  selectedOrg: Organization;
  setSelectedOrg: (org: Organization) => void;
}


const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [selectedOrg, setSelectedOrg] = useState<Organization>('All');

  useEffect(() => {
    localStorage.setItem('selectedOrg', selectedOrg);
  }, [selectedOrg]);

  return (
    <OrgContext.Provider value={{ selectedOrg, setSelectedOrg }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error('useOrg must be used within a OrgProvider');
  }
  return context;
}
