import { cancelMyStayRequest } from '@/app/homes/[id]/actions';
import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs/server';
import { getMyStayRequests } from '@org/db';
import { formatDate } from '@org/types';
import Link from 'next/link';
import { redirect } from 'next/navigation';

function formatStatus(status: 'pending' | 'approved' | 'rejected') {
  if (status === 'approved') {
    return 'Approved';
  }
  if (status === 'rejected') {
    return 'Rejected';
  }
  return 'Pending';
}

export default async function MyRequestsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const requests = await getMyStayRequests(userId);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 md:px-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">My requests</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review your outgoing swap requests and cancel pending ones.
        </p>

        {requests.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">You have not requested any stays yet.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {requests.map((request) => (
              <li
                key={request.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-800">
                    <Link href={`/homes/${request.homeId}`} className="hover:underline">
                      {request.homeDescription || `${request.homeCity}, ${request.homeCountry}`}
                    </Link>
                  </p>
                  <p className="text-xs text-slate-500">
                    {request.homeCity}, {request.homeCountry}
                  </p>
                  <p className="text-xs text-slate-500">
                    Requested dates: {formatDate(request.requestedStartDate)} -{' '}
                    {formatDate(request.requestedEndDate)}
                  </p>
                  <p className="text-xs text-slate-500">Status: {formatStatus(request.status)}</p>
                </div>
                {request.status === 'pending' ? (
                  <form action={cancelMyStayRequest}>
                    <input type="hidden" name="requestId" value={request.id} />
                    <Button type="submit" size="sm" variant="outline">
                      Cancel request
                    </Button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
