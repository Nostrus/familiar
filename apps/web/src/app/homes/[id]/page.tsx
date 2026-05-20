import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { HomeView, HomeViewSkeleton } from './components/home-view';

export default async function HomePage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { userId } = await auth();
  const params = await props.params;
  const searchParams = await props.searchParams;
  const homeId = parseInt(params.id, 10);

  if (isNaN(homeId)) {
    notFound();
  }

  return (
    <Suspense fallback={<HomeViewSkeleton />}>
      <HomeView homeId={homeId} userId={userId ?? null} isEditing={searchParams.edit === '1'} />
    </Suspense>
  );
}
