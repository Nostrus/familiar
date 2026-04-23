import { getFeaturedHomes } from '@/db/queries/get-featured-homes';
import { Bath, Bed, Users } from 'lucide-react';
import Link from 'next/link';

export async function FeaturedHomes() {
  const homes = await getFeaturedHomes();

  if (!homes || homes.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold text-primary">Featured</p>
        <h2 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          Discover Amazing Homes
        </h2>
        <p className="max-w-xl text-base text-slate-600">
          Hand-picked homes from our community. Each offers unique character and comfort.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {homes.map((home) => (
          <Link
            key={home.id}
            href={`/homes/${home.id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 transition-all hover:shadow-lg hover:border-primary"
          >
            {/* Header */}
            <div className="border-b border-slate-100 p-6">
              <p className="mb-1 text-xs font-semibold text-primary">
                {home.city}, {home.country}
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4 text-slate-400" />
                  {home.bedrooms} {home.bedrooms === 1 ? 'bed' : 'beds'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-slate-400" />
                  {home.bathrooms} {home.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-400" />
                  {home.maxGuests} {home.maxGuests === 1 ? 'guest' : 'guests'}
                </span>
              </div>
            </div>

            {/* Placeholder Image */}
            <div className="grow bg-slate-100">
              <div className="h-48 w-full bg-linear-to-br from-slate-200 to-slate-300" />
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-linear-to-r from-slate-50 to-transparent p-6 text-sm font-semibold text-primary transition-colors group-hover:text-slate-900">
              <span>View details</span>
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
