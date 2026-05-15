import { HomeCard } from '@/components/home-card';
import { getHomesByCity } from '@org/db';
import Link from 'next/link';

type DiscoverResultsProps = {
  selectedCities: string[];
  dateFrom?: string;
  dateTo?: string;
  guests?: number;
};

export async function DiscoverResults({
  selectedCities,
  dateFrom,
  dateTo,
  guests,
}: DiscoverResultsProps) {
  const homesByCity = await getHomesByCity({
    cities: selectedCities.length > 0 ? selectedCities : undefined,
    dateFrom,
    dateTo,
    guests: guests && !isNaN(guests) ? guests : undefined,
  });

  const cityEntries = Object.entries(homesByCity);

  if (cityEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-slate-700">No homes match your filters.</p>
        <p className="mt-2 text-sm text-slate-500">
          Try adjusting the date range or removing some filters.
        </p>
        <Link href="/discover" className="mt-6 text-sm font-semibold text-primary hover:underline">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {cityEntries.map(([city, cityHomes], cityIndex) => (
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
            {cityHomes.map((home, homeIndex) => (
              <HomeCard
                key={home.id}
                home={home}
                preferPhoto
                showLocation={false}
                priority={cityIndex === 0 && homeIndex < 2}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
