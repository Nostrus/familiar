import { MoveRight } from 'lucide-react';
import Link from 'next/link';

export type BubbleDestination = {
  city: string;
  country: string;
  homes: number;
  tagline: string;
};

type BubbleCardProps = {
  destination: BubbleDestination;
};

export function BubbleCard({ destination }: BubbleCardProps) {
  return (
    <Link
      href={`/discover?cities=${encodeURIComponent(destination.city)}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {destination.country}
          </p>
          <h3 className="mt-0.5 text-xl font-semibold text-foreground">{destination.city}</h3>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {destination.homes.toLocaleString()} homes
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{destination.tagline}</p>
      <div className="mt-auto pt-4 flex items-center gap-1 text-sm font-medium text-primary">
        Browse listings
        <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
