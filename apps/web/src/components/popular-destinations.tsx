import { BubbleCard } from '@/components/bubble-card';

const destinations = [
  {
    city: 'Paris',
    country: 'France',
    homes: 382,
    tagline: 'Charming Haussmann apartments and Montmartre studios steps from the best bistros.',
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    homes: 294,
    tagline: 'Modernist flats, rooftop terraces, and beach-side bungalows across the city.',
  },
  {
    city: 'Lisbon',
    country: 'Portugal',
    homes: 211,
    tagline: "Pastel-tiled townhouses and hilltop miradouro views in one of Europe's gems.",
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    homes: 187,
    tagline: 'Traditional machiya, minimalist apartments, and quiet garden retreats.',
  },
  {
    city: 'New York',
    country: 'United States',
    homes: 425,
    tagline: 'Brooklyn brownstones, Manhattan lofts, and Upper West Side classic sixes.',
  },
  {
    city: 'Amsterdam',
    country: 'Netherlands',
    homes: 163,
    tagline: 'Canal-front townhouses and creative Jordaan-neighbourhood flats.',
  },
];

export function PopularDestinations() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
      <div className="mb-10">
        <p className="mb-2 text-sm font-medium tracking-widest text-primary uppercase">
          Where to next
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Popular destinations
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Thousands of verified homes waiting in the world's most-loved cities. Find your next swap.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination) => (
          <BubbleCard key={destination.city} destination={destination} />
        ))}
      </div>
    </section>
  );
}
