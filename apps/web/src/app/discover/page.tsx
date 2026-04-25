import { DiscoverFilter } from '@/components/discover-filter';
import { HomeCard } from '@/components/home-card';
import { getCities } from '@/db/queries/get-cities';
import { getHomesByCity } from '@/db/queries/get-homes-by-city';
import Link from 'next/link';
import { Suspense } from 'react';

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

  const [homesByCity, citiesData] = await Promise.all([
    getHomesByCity({
      cities: selectedCities.length > 0 ? selectedCities : undefined,
      dateFrom: params.from,
      dateTo: params.to,
      guests: guests && !isNaN(guests) ? guests : undefined,
    }),
    getCities({ limit: 20 }),
  ]);

  const allCityNames = citiesData.map((c) => c.city);
  const cityEntries = Object.entries(homesByCity);

  return (
    <main className="min-h-screen ">
      <Suspense>
        <DiscoverFilter allCities={allCityNames} />
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

        {cityEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-medium text-slate-700">No homes match your filters.</p>
            <p className="mt-2 text-sm text-slate-500">
              Try adjusting the date range or removing some filters.
            </p>
            <Link
              href="/discover"
              className="mt-6 text-sm font-semibold text-primary hover:underline"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {cityEntries.map(([city, cityHomes]) => (
              <section key={city}>
                <div className="mb-6 flex items-baseline justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {city}, {cityHomes[0]?.country}
                  </h2>
                  <span className="text-sm text-slate-500">
                    {cityHomes.length} {cityHomes.length === 1 ? 'home' : 'homes'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cityHomes.map((home) => (
                    <HomeCard key={home.id} home={home} preferPhoto showLocation={false} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
