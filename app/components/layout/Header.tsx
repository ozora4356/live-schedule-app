'use client';

import { Sidebar } from './Sidebar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { OrgSelect } from '../ui/OrgSelect';

export default function Header() {
  return (
    <header className="relative block lg:hidden w-full dark:bg-gray-800 bg-white px-4 shadow-md">
      <div className="flex flex-row-reverse w-full h-16 items-center gap-4 lg:flex-row lg:justify-between lg:gap-0 justify-between">
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <Sidebar />
          </div>
          {/* <h1 className="text-[32px] text-slate-900 dark:text-white"></h1> */}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <OrgSelect />
        </div>
      </div>
    </header>
  );
}
