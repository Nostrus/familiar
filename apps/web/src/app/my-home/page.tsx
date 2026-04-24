import { db } from '@/db';
import { homes } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function MyHomePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const ownedHomes = await db.select({ id: homes.id }).from(homes).where(eq(homes.ownerId, userId));

  if (ownedHomes.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-12 md:px-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">My Home</h1>
          <p className="mt-2 text-sm text-slate-600">You do not have a home assigned yet.</p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Back to homepage
          </Link>
        </section>
      </main>
    );
  }

  redirect(`/homes/${ownedHomes[0].id}`);
}
