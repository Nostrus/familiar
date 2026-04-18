import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card">
          <div className="absolute inset-0 scale-105 bg-[url('/hero-image.jpg')] bg-cover bg-center blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/60" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/15 to-transparent" />

          <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-20 text-center sm:px-10 md:px-16 md:py-28">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl md:text-6xl">
              Home swapping, reimagined
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              The best way to travel is to live like you already belong there. Swap homes with
              trusted members, skip hotel prices, and stay in real neighborhoods.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="px-8">
                <Link href="#">Start Swapping</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="px-8">
                <Link href="#">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-3 pt-6">
          <div className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
            50,000+ nights swapped
          </div>
          <div className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
            Verified member profiles
          </div>
          <div className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
            4.9 average host rating
          </div>
        </div>
      </section>
    </main>
  );
}
