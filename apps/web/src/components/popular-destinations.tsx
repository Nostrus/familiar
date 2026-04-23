import { PopularDestinationsContent } from '@/components/popular-destinations-content';
import { PopularDestinationsSkeleton } from '@/components/popular-destinations-skeleton';
import { Suspense } from 'react';

export function PopularDestinations() {
  return (
    <Suspense fallback={<PopularDestinationsSkeleton />}>
      <PopularDestinationsContent />
    </Suspense>
  );
}
