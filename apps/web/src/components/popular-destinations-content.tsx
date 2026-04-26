import { BubbleCard } from '@/components/bubble-card';
import { getCities } from '@/db/queries/get-cities';

export async function PopularDestinationsContent() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const destinations = await getCities({ limit: 6 });

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
        {destinations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No destinations available yet.</p>
        ) : (
          destinations.map((destination) => (
            <BubbleCard key={destination.city} destination={destination} />
          ))
        )}
      </div>
    </section>
  );
}
