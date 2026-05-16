import { Show, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
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
        <Link
          href="/discover"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Discover
        </Link>
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
  );
}
