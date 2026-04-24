import { auth } from '@clerk/nextjs/server';
import { getHome } from '@/db/queries/get-home';
import { Bath, Bed, Users } from 'lucide-react';
import { notFound } from 'next/navigation';
import { HomeAmenities } from './components/home-amenities';
import { HomeAvailability } from './components/home-availability';
import { HomeStayRequests } from './components/home-stay-requests';

export default async function HomePage(props: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const params = await props.params;
  const homeId = parseInt(params.id, 10);

  if (isNaN(homeId)) {
    notFound();
  }

  const home = await getHome(homeId, userId ?? undefined);

  if (!home) {
    notFound();
  }

  const homeTitle = home.description || `${home.bedrooms} bd, ${home.bathrooms} ba home`;
  const isOwner = !!userId && home.ownerId === userId;
  const canReceiveRequests = !!home.ownerId;

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto w-full max-w-4xl px-6 py-8 md:px-10">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {home.city}, {home.country}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{homeTitle}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-slate-700">
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
      </div>

      <div className="mx-auto w-full max-w-4xl space-y-10 px-6 py-12 md:px-10">
        <HomeStayRequests
          homeId={home.id}
          isOwner={isOwner}
          canReceiveRequests={canReceiveRequests}
          viewerRequest={home.viewerRequest}
          pendingRequestsForOwner={home.pendingRequestsForOwner}
        />
        <HomeAmenities amenities={home.amenities} />
        <HomeAvailability availability={home.availability} />
      </div>
    </main>
  );
}
