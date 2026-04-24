import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function MyFavoritesPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 md:px-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">My favorites</h1>
        <p className="mt-2 text-sm text-slate-600">
          Favorites are coming soon. You will be able to save homes here.
        </p>
      </section>
    </main>
  );
}
