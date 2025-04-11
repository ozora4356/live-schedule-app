import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { OrgProvider } from './contexts/OrgContext';
import { FavoriteProvider } from './contexts/FavoriteContext';
import { SortProvider } from './contexts/SortContext';
import { LiveStreamProvider } from './contexts/LiveStreamContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import Header from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const   badlyFormattedCode    =    "test"   ;
console.error(badlyFormattedCode);

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vtuber Live Streaming',
  description: 'Vtuberの配信をリアルタイムでチェック!',
  openGraph: {
    title: 'Vtuber Live Streaming',
    description: 'Vtuberの配信をリアルタイムでチェック!',
    url: 'https://v-live-pi.vercel.app/',
    siteName: 'Vtuber Live Streaming',
    images: [
      {
        url: 'https://v-live-pi.vercel.app/og-image.png?20250202',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vtuber Live Streaming',
    description: 'Vtuberの配信をリアルタイムでチェック!',
    images: ['https://v-live-pi.vercel.app/og-image.png?20250202'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
                        <main className="flex-1 px-4 py-8 lg:px-6 lg:py-16">
                          {children}
                        </main>
                      </div>
                    </div>
                  </ScheduleProvider>
                </LiveStreamProvider>
              </SortProvider>
            </FavoriteProvider>
          </OrgProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
