'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useLiveStreamsAll } from '@/app/contexts/LiveStreamContext';
import { ThemeToggle } from './ThemeToggle';
import { OrgSelect } from './OrgSelect';
import { FavoriteList } from '../stream/FavoriteList';

export function Sidebar() {
  const allLiveStreams = useLiveStreamsAll();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* デスクトップ表示 */}
      <div className="hidden lg:block lg:sticky top-0 left-0 h-[100vh] w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="py-8 lg:px-4">
          <div className="flex gap-2">
            <ThemeToggle />
            <OrgSelect />
          </div>
          <div className="mt-8">
            <FavoriteList liveStreams={allLiveStreams} />
          </div>
        </div>
      </div>

      {/* モバイル表示 */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* オーバーレイ */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* サイドバー */}
        <div
          className={`fixed top-0 left-0 w-64 h-full bg-gray-50 dark:bg-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <FavoriteList liveStreams={allLiveStreams} />
          </div>
        </div>
      </div>
    </>
  );
}
