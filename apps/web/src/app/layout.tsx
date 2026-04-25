import { ensureClerkUser } from '@/lib/ensure-clerk-user';
import { cn } from '@/lib/utils';
import { ClerkProvider, Show, UserButton } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const nunitoSans = Nunito_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Familiar — Home Swapping, Reimagined',
  description:
    'Swap homes with trusted members around the world. Skip hotel prices and stay in real neighborhoods like a local.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  await ensureClerkUser({
    clerkUserId: userId,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.primaryEmailAddress?.emailAddress,
  });

  return (
    <ClerkProvider>
      <html lang="en" className={cn('font-sans', nunitoSans.variable)}>
        <body>
          <header className="mx-auto flex w-full max-w-6xl items-center justify-end gap-3 px-6 py-4 md:px-10">
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
            </Show>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
