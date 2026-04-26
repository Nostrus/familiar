import { HomeCard } from '@/components/home-card';
import { getFeaturedHomes } from '@/db/queries/get-featured-homes';

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
          <HomeCard key={home.id} home={home} preferPhoto />
        ))}
      </div>
    </section>
  );
}
