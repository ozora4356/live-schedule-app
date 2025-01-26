import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { OrgProvider } from '@/app/contexts/OrgContext';
import { FavoriteProvider } from '@/app/contexts/FavoriteContext';
import { SortProvider } from '@/app/contexts/SortContext';
import { LiveStreamProvider } from '@/app/contexts/LiveStreamContext';
import { ScheduleProvider } from '@/app/contexts/ScheduleContext';
import { ThemeProvider } from './contexts/ThemeContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vtuber Live Streaming',
  description: 'Vtuberの配信をチェック',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <OrgProvider>
            <FavoriteProvider>
              <SortProvider>
                <LiveStreamProvider>
                  <ScheduleProvider>
                    <div>
                      <Header />
                      <div className="flex">
                        <div className="hidden lg:block">
                          <Sidebar />
                        </div>
                        <main className="flex-1 p-4 md:px-6 py-16">{children}</main>
                      </div>
                    </div>
                  </ScheduleProvider>
                </LiveStreamProvider>
              </SortProvider>
            </FavoriteProvider>
          </OrgProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
