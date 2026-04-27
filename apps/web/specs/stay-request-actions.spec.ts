/**
 * Critical tests for createStayRequest server action.
 * Covers auth guard, date ordering rule, and self-request prevention.
 */

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }));
jest.mock('../src/lib/ensure-clerk-user', () => ({ ensureClerkUser: jest.fn() }));
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@org/db', () => ({
  db: { select: jest.fn(), insert: jest.fn() },
  homes: { id: 'id', ownerId: 'owner_id' },
  homeStayRequests: {
    id: 'id',
    homeId: 'home_id',
    requesterId: 'requester_id',
    status: 'status',
  },
}));

import { auth } from '@clerk/nextjs/server';
import { db } from '@org/db';
import { createStayRequest } from '../src/app/homes/[id]/actions';

const mockAuth = auth as unknown as jest.Mock;
const mockDbSelect = db.select as jest.Mock;
const mockDbInsert = db.insert as jest.Mock;

// Reusable drizzle chain that resolves to `result` at `.limit()`
function chain(result: unknown) {
  const self: Record<string, () => unknown> = {};
  ['select', 'from', 'where', 'limit', 'insert', 'values'].forEach((m) => {
    self[m] = () => (m === 'limit' ? Promise.resolve(result) : self);
  });
  return self;
}

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createStayRequest', () => {
  it('throws when user is not signed in', async () => {
    mockAuth.mockResolvedValue({ userId: null });
    await expect(
      createStayRequest(
        makeFormData({
          homeId: '1',
          requestedStartDate: '2026-06-01',
          requestedEndDate: '2026-06-10',
        }),
      ),
    ).rejects.toThrow('signed in');
  });

  it('throws when start date is in the past', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    await expect(
      createStayRequest(
        makeFormData({
          homeId: '1',
          requestedStartDate: '2020-01-01',
          requestedEndDate: '2020-01-10',
        }),
      ),
    ).rejects.toThrow('Start date cannot be in the past');
  });

  it('throws when start date is after end date', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });

    // Home owned by someone else so we get past the owner check
    const homeChain = chain([{ id: 1, ownerId: 'owner_other' }]);
    // Second select (existing pending requests) returns empty
    const pendingChain = chain([]);
    let callCount = 0;
    mockDbSelect.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? homeChain : pendingChain;
    });

    await expect(
      createStayRequest(
        makeFormData({
          homeId: '1',
          requestedStartDate: '2026-06-10',
          requestedEndDate: '2026-06-01',
        }),
      ),
    ).rejects.toThrow('start date must be before end date');
  });

  it('throws when user tries to request their own home', async () => {
    mockAuth.mockResolvedValue({ userId: 'owner_1' });

    const homeChain = chain([{ id: 1, ownerId: 'owner_1' }]);
    mockDbSelect.mockReturnValue(homeChain);

    await expect(
      createStayRequest(
        makeFormData({
          homeId: '1',
          requestedStartDate: '2026-06-01',
          requestedEndDate: '2026-06-10',
        }),
      ),
    ).rejects.toThrow('cannot request your own home');
  });

  it('inserts a stay request for a valid request', async () => {
    mockAuth.mockResolvedValue({ userId: 'requester_1' });

    const homeChain = chain([{ id: 1, ownerId: 'owner_other' }]);
    const pendingChain = chain([]); // no existing pending

    let callCount = 0;
    mockDbSelect.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? homeChain : pendingChain;
    });

    const valuesResolves = jest.fn().mockResolvedValue(undefined);
    mockDbInsert.mockReturnValue({ values: valuesResolves });

    await createStayRequest(
      makeFormData({
        homeId: '1',
        requestedStartDate: '2026-06-01',
        requestedEndDate: '2026-06-10',
      }),
    );

    expect(mockDbInsert).toHaveBeenCalledTimes(1);
    expect(valuesResolves).toHaveBeenCalledWith(
      expect.objectContaining({
        homeId: 1,
        requesterId: 'requester_1',
        status: 'pending',
      }),
    );
  });
});
