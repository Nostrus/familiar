import Image from 'next/image';

const trustBadges = [
  '50,000+ nights swapped',
  'Verified member profiles',
  '4.9 average host rating',
];

const DEFAULT_HERO_IMAGE_URL =
  'https://ftpbpwydhyollunz.public.blob.vercel-storage.com/home-samples/japanese/ChatGPT-Image-Apr-26-2026-05_13_04-PM-1-cc64784a.webp';

const heroImageUrl = process.env.NEXT_PUBLIC_HERO_IMAGE_URL ?? DEFAULT_HERO_IMAGE_URL;

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card">
        <div className="absolute inset-0 scale-105 overflow-hidden">
          <Image
            src={heroImageUrl}
            alt=""
            fill
            priority
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 1152px"
            className="object-cover blur-[1px] scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/35 to-black/60" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white/15 to-transparent" />

        <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-20 text-center sm:px-10 md:px-16 md:py-28">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl md:text-6xl">
            Home swapping, reimagined
          </h1>

          <p className="max-w-2xl leading-relaxed text-white/85 sm:text-lg">
            The best way to travel is to live like you already belong there. Swap homes with trusted
            members, skip hotel prices, and stay in real neighborhoods.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-3 pt-6">
        {trustBadges.map((badge) => (
          <div
            key={badge}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
          >
            {badge}
          </div>
        ))}
      </div>
    </section>
  );
}
