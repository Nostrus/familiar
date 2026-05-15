import { Suspense } from 'react';
import { DiscoverFilterSection } from './discover-filter-section';
import { DiscoverResults } from './discover-results';

type SearchParams = Promise<{
  cities?: string;
  from?: string;
  to?: string;
  guests?: string;
}>;

export default async function DiscoverPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const selectedCities = params.cities ? params.cities.split(',').filter(Boolean) : [];
  const guests = params.guests ? parseInt(params.guests, 10) : undefined;

  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="mx-auto max-w-6xl px-6 py-4 md:px-10" />}>
        <DiscoverFilterSection />
      </Suspense>

      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold text-primary">Discover</p>
          <h1 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Homes around the world
          </h1>
          <p className="max-w-xl text-base text-slate-600">
            Browse verified homes in every city. Find your next swap.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          }
        >
          <DiscoverResults
            selectedCities={selectedCities}
            dateFrom={params.from}
            dateTo={params.to}
            guests={guests}
          />
        </Suspense>
      </div>
    </main>
  );
}
