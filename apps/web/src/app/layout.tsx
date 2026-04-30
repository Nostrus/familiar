import { cn } from '@/lib/utils';
import { ClerkProvider, Show, UserButton } from '@clerk/nextjs';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';

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
          <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4 md:px-10">
            <Link
              href="/"
              aria-label="Go to home page"
              className="flex items-center gap-3 rounded-full pr-3 transition-opacity hover:opacity-85"
            >
              <span className="relative h-10 w-10 overflow-hidden rounded-full border border-border/60 bg-card shadow-sm">
                <Image
                  src="/icon.svg"
                  alt="Familiar logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="text-sm font-semibold tracking-[0.18em] text-slate-900 uppercase">
                Familiar
              </span>
            </Link>

            <div className="flex items-center gap-10">
              <Show when="signed-out">
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Sign up
                </Link>
              </Show>
              <Show when="signed-in">
                <section className="flex items-center gap-10">
                  <Link
                    href="/discover"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Discover
                  </Link>
                  <Link
                    href="/my-home"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    My Home
                  </Link>
                  <Link
                    href="/my-requests"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    My requests
                  </Link>
                  <Link
                    href="/my-favorites"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    My favorites
                  </Link>
                  <Link
                    href="/my-profile"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    My profile
                  </Link>
                  <UserButton />
                </section>
              </Show>
            </div>
          </header>
          {children}
        </body>
      </html>
      <SpeedInsights />
    </ClerkProvider>
  );
}
