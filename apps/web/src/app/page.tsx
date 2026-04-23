import { FeaturedHomes } from '@/components/featured-homes';
import { Hero } from '@/components/hero';
import { HowItWorks } from '@/components/how-it-works';
import { PopularDestinations } from '@/components/popular-destinations';

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedHomes />
      <PopularDestinations />
      <HowItWorks />
    </main>
  );
}
