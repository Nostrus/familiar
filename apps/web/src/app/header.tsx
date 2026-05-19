'use client';

import { cn } from '@/lib/utils';
import { Show, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const navLink = (href: string) =>
    cn(
      'text-sm font-medium transition-colors',
      pathname === href || pathname.startsWith(href + '/')
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground',
    );

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4 md:px-10">
      <Link
        href="/"
        aria-label="Go to home page"
        className="flex items-center gap-3 rounded-full pr-3 transition-opacity hover:opacity-85"
      >
        <span className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image src="/icon.svg" alt="Familiar logo" fill sizes="40px" className="object-cover" />
        </span>
        <span className="text-primary text-sm font-semibold tracking-[0.18em] uppercase">
          Familiar
        </span>
      </Link>

      <div className="flex items-center gap-10">
        <Link href="/discover" className={navLink('/discover')}>
          Discover
        </Link>
        <Show when="signed-out">
          <Link href="/sign-in" className={navLink('/sign-in')}>
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
            <Link href="/my-home" className={navLink('/my-home')}>
              My Home
            </Link>
            <Link href="/my-requests" className={navLink('/my-requests')}>
              My requests
            </Link>
            <Link href="/my-favorites" className={navLink('/my-favorites')}>
              My favorites
            </Link>
            <Link href="/my-profile" className={navLink('/my-profile')}>
              My profile
            </Link>
            <UserButton />
          </section>
        </Show>
      </div>
    </header>
  );
}
