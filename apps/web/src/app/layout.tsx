import { cn } from '@/lib/utils';
import { ClerkProvider } from '@clerk/nextjs';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import './globals.css';
import { Header } from './header';

const nunitoSans = Nunito_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Familiar — Home Swapping, Reimagined',
  description:
    'Swap homes with trusted members around the world. Skip hotel prices and stay in real neighborhoods like a local.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn('font-sans', nunitoSans.variable)}>
        <body className="bg-background text-foreground">
          <Header />
          {children}
        </body>
      </html>
      <SpeedInsights />
    </ClerkProvider>
  );
}
