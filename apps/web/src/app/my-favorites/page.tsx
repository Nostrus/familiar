import { HomeCard } from '@/components/home-card';
import { getMyFavoriteHomes } from '@org/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function MyFavoritesPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const favorites = await getMyFavoriteHomes(userId);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">My favorites</h1>
        <p className="mt-2 text-sm text-slate-600">
          Keep track of the homes you want to revisit and compare later.
        </p>

        {favorites.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">You have not saved any homes yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((home) => (
              <HomeCard key={home.id} home={home} preferPhoto />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
