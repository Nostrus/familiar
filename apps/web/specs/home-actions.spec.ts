/**
 * Unit tests for toggleFavorite and updateStayRequestStatus server actions.
 */

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }));
jest.mock('../src/lib/ensure-clerk-user', () => ({ ensureClerkUser: jest.fn() }));
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@org/db', () => ({
  db: { select: jest.fn(), insert: jest.fn(), delete: jest.fn(), update: jest.fn() },
  homes: { id: 'id', ownerId: 'owner_id' },
  homeFavorites: { id: 'id', homeId: 'home_id', userId: 'user_id' },
  homeStayRequests: {
    id: 'id',
    homeId: 'home_id',
    requesterId: 'requester_id',
    status: 'status',
    updatedAt: 'updated_at',
  },
  toggleHomeFavorite: jest.fn(),
  updateStayRequestStatus: jest.fn(),
}));

import { auth } from '@clerk/nextjs/server';
import { updateStayRequestStatus as dbUpdateStayRequestStatus, toggleHomeFavorite } from '@org/db';
import { toggleFavorite, updateStayRequestStatus } from '../src/app/homes/[id]/actions';

const mockAuth = auth as unknown as jest.Mock;
const mockToggleHomeFavorite = toggleHomeFavorite as jest.Mock;
const mockDbUpdateStayRequestStatus = dbUpdateStayRequestStatus as jest.Mock;

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

beforeEach(() => jest.clearAllMocks());

// ---------------------------------------------------------------------------
// toggleFavorite
// ---------------------------------------------------------------------------

describe('toggleFavorite', () => {
  it('throws when not signed in', async () => {
    mockAuth.mockResolvedValue({ userId: null });
    await expect(toggleFavorite(makeFormData({ homeId: '5' }))).rejects.toThrow('signed in');
  });

  it('removes the favorite when one already exists', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    mockToggleHomeFavorite.mockResolvedValue({ isFavorited: false });

    await toggleFavorite(makeFormData({ homeId: '5' }));

    expect(mockToggleHomeFavorite).toHaveBeenCalledWith({ homeId: 5, userId: 'u1' });
  });

  it('inserts a favorite when none exists', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    mockToggleHomeFavorite.mockResolvedValue({ isFavorited: true });

    await toggleFavorite(makeFormData({ homeId: '5' }));

    expect(mockToggleHomeFavorite).toHaveBeenCalledWith({ homeId: 5, userId: 'u1' });
  });
});

// ---------------------------------------------------------------------------
// updateStayRequestStatus
// ---------------------------------------------------------------------------

describe('updateStayRequestStatus', () => {
  it('throws when not signed in', async () => {
    mockAuth.mockResolvedValue({ userId: null });
    await expect(
      updateStayRequestStatus(makeFormData({ homeId: '1', requestId: '2', status: 'approved' })),
    ).rejects.toThrow('signed in');
  });

  it('throws for an invalid status value', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    await expect(
      updateStayRequestStatus(makeFormData({ homeId: '1', requestId: '2', status: 'cancelled' })),
    ).rejects.toThrow('Invalid status');
  });

  it('throws when the caller is not the home owner', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    mockDbUpdateStayRequestStatus.mockRejectedValue(
      new Error('You are not allowed to update this request.'),
    );
    await expect(
      updateStayRequestStatus(makeFormData({ homeId: '1', requestId: '2', status: 'approved' })),
    ).rejects.toThrow('not allowed');
  });

  it('updates the request status when the owner approves', async () => {
    mockAuth.mockResolvedValue({ userId: 'owner_1' });
    mockDbUpdateStayRequestStatus.mockResolvedValue(undefined);

    await updateStayRequestStatus(
      makeFormData({ homeId: '1', requestId: '2', status: 'approved' }),
    );

    expect(mockDbUpdateStayRequestStatus).toHaveBeenCalledWith({
      requestId: 2,
      homeId: 1,
      userId: 'owner_1',
      nextStatus: 'approved',
    });
  });
});
