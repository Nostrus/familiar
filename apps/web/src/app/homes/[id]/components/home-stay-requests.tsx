import { Button } from '@/components/ui/button';
import { Show } from '@clerk/nextjs';
import Link from 'next/link';
import { createStayRequest, updateStayRequestStatus } from '../actions';

type ViewerRequest = {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedStartDate: string;
  requestedEndDate: string;
  createdAt: Date;
};

type PendingOwnerRequest = {
  id: number;
  requesterId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedStartDate: string;
  requestedEndDate: string;
  createdAt: Date;
};

type HomeStayRequestsProps = {
  homeId: number;
  isOwner: boolean;
  canReceiveRequests: boolean;
  viewerRequest: ViewerRequest | null;
  pendingRequestsForOwner: PendingOwnerRequest[];
};

function formatStatus(status: ViewerRequest['status']) {
  if (status === 'approved') return 'Approved';
  if (status === 'rejected') return 'Rejected';
  return 'Pending';
}

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function HomeStayRequests({
  homeId,
  isOwner,
  canReceiveRequests,
  viewerRequest,
  pendingRequestsForOwner,
}: HomeStayRequestsProps) {
  if (isOwner) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Incoming stay requests</h2>
        {pendingRequestsForOwner.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No pending requests right now.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pendingRequestsForOwner.map((request) => (
              <li
                key={request.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{request.requesterId}</p>
                  <p className="text-xs text-slate-500">
                    Requested dates: {formatDate(request.requestedStartDate)} -{' '}
                    {formatDate(request.requestedEndDate)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Requested {new Date(request.createdAt).toLocaleDateString('en-US')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={updateStayRequestStatus}>
                    <input type="hidden" name="homeId" value={homeId} />
                    <input type="hidden" name="requestId" value={request.id} />
                    <input type="hidden" name="status" value="approved" />
                    <Button type="submit" size="sm">
                      Approve
                    </Button>
                  </form>
                  <form action={updateStayRequestStatus}>
                    <input type="hidden" name="homeId" value={homeId} />
                    <input type="hidden" name="requestId" value={request.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <Button type="submit" size="sm" variant="outline">
                      Reject
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Stay request</h2>

      <Show when="signed-out">
        <p className="mt-2 text-sm text-slate-600">
          <Link href="/sign-in" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>{' '}
          to request a stay at this home.
        </p>
      </Show>

      <Show when="signed-in">
        {!canReceiveRequests ? (
          <p className="mt-2 text-sm text-slate-500">This home cannot receive requests yet.</p>
        ) : viewerRequest ? (
          <div className="mt-2 space-y-1 text-sm text-slate-700">
            <p>
              Your latest request status:{' '}
              <span className="font-semibold">{formatStatus(viewerRequest.status)}</span>
            </p>
            <p className="text-slate-500">
              Requested dates: {formatDate(viewerRequest.requestedStartDate)} -{' '}
              {formatDate(viewerRequest.requestedEndDate)}
            </p>
          </div>
        ) : (
          <form action={createStayRequest} className="mt-4 space-y-3">
            <input type="hidden" name="homeId" value={homeId} />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Start date
                <input
                  type="date"
                  name="requestedStartDate"
                  required
                  className="h-10 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-400"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                End date
                <input
                  type="date"
                  name="requestedEndDate"
                  required
                  className="h-10 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-400"
                />
              </label>
            </div>
            <Button type="submit">Request stay</Button>
          </form>
        )}
      </Show>
    </section>
  );
}
