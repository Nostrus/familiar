/**
 * Unit tests for toggleFavorite and updateStayRequestStatus server actions.
 */

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }));
jest.mock('../src/lib/ensure-clerk-user', () => ({ ensureClerkUser: jest.fn() }));
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('../src/db', () => ({
  db: { select: jest.fn(), insert: jest.fn(), delete: jest.fn(), update: jest.fn() },
}));

import { auth } from '@clerk/nextjs/server';
import { toggleFavorite, updateStayRequestStatus } from '../src/app/homes/[id]/actions';
import { db } from '../src/db';

const mockAuth = auth as jest.Mock;
const mockDbSelect = db.select as jest.Mock;
const mockDbInsert = db.insert as jest.Mock;
const mockDbDelete = db.delete as jest.Mock;
const mockDbUpdate = db.update as jest.Mock;

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

/** Builds a chain where `.limit()` resolves, all other calls return `this`. */
function limitChain(result: unknown) {
  const self: Record<string, () => unknown> = {};
  ['select', 'from', 'where', 'limit', 'innerJoin'].forEach((m) => {
    self[m] = () => (m === 'limit' ? Promise.resolve(result) : self);
  });
  return self;
}

/** Builds a chain where `.where()` resolves (used for delete/update with no limit). */
function whereChain() {
  const self: Record<string, () => unknown> = {};
  ['delete', 'update', 'set', 'where'].forEach((m) => {
    self[m] = () => (m === 'where' ? Promise.resolve(undefined) : self);
  });
  return self;
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
    // select returns an existing favorite
    mockDbSelect.mockReturnValue(limitChain([{ id: 42 }]));
    mockDbDelete.mockReturnValue(whereChain());

    await toggleFavorite(makeFormData({ homeId: '5' }));

    expect(mockDbDelete).toHaveBeenCalledTimes(1);
    expect(mockDbInsert).not.toHaveBeenCalled();
  });

  it('inserts a favorite when none exists', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    // select returns empty
    mockDbSelect.mockReturnValue(limitChain([]));
    const valuesResolves = jest.fn().mockResolvedValue(undefined);
    mockDbInsert.mockReturnValue({ values: valuesResolves });

    await toggleFavorite(makeFormData({ homeId: '5' }));

    expect(mockDbInsert).toHaveBeenCalledTimes(1);
    expect(valuesResolves).toHaveBeenCalledWith(
      expect.objectContaining({ homeId: 5, userId: 'u1' }),
    );
    expect(mockDbDelete).not.toHaveBeenCalled();
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
    mockDbSelect.mockReturnValue(
      limitChain([{ id: 2, homeId: 1, status: 'pending', ownerId: 'owner_other' }]),
    );
    await expect(
      updateStayRequestStatus(makeFormData({ homeId: '1', requestId: '2', status: 'approved' })),
    ).rejects.toThrow('not allowed');
  });

  it('updates the request status when the owner approves', async () => {
    mockAuth.mockResolvedValue({ userId: 'owner_1' });
    mockDbSelect.mockReturnValue(
      limitChain([{ id: 2, homeId: 1, status: 'pending', ownerId: 'owner_1' }]),
    );
    const setChain = whereChain();
    mockDbUpdate.mockReturnValue(setChain);

    await updateStayRequestStatus(
      makeFormData({ homeId: '1', requestId: '2', status: 'approved' }),
    );

    expect(mockDbUpdate).toHaveBeenCalledTimes(1);
  });
});
