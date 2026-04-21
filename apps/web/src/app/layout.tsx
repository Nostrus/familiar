import { cn } from '@/lib/utils';
import { Nunito_Sans } from 'next/font/google';
import './globals.css';

const nunitoSans = Nunito_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'Familiar — Home Swapping, Reimagined',
  description:
    'Swap homes with trusted members around the world. Skip hotel prices and stay in real neighborhoods like a local.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('font-sans', nunitoSans.variable)}>
      <body>{children}</body>
    </html>
  );
}
