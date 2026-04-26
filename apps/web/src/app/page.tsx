import { FeaturedHomes } from '@/components/featured-homes';
import { FeaturedHomesSkeleton } from '@/components/featured-homes-skeleton';
import { Hero } from '@/components/hero';
import { HowItWorks } from '@/components/how-it-works';
import { PopularDestinations } from '@/components/popular-destinations';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Suspense fallback={<FeaturedHomesSkeleton />}>
        <FeaturedHomes />
      </Suspense>
      <PopularDestinations />
      <HowItWorks />
    </main>
  );
}
