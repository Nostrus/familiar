jest.mock('@org/db', () => ({
  db: { insert: jest.fn() },
  clerkUsers: { clerkUserId: 'clerk_user_id' },
}));

import { db } from '@org/db';
import { ensureClerkUser } from '../src/lib/ensure-clerk-user';

const mockDbInsert = db.insert as jest.Mock;

function setupInsertChain() {
  const onConflictDoUpdate = jest.fn().mockResolvedValue(undefined);
  const values = jest.fn().mockReturnValue({ onConflictDoUpdate });
  mockDbInsert.mockReturnValue({ values });
  return { values, onConflictDoUpdate };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ensureClerkUser', () => {
  it('does not overwrite profile fields when they are omitted', async () => {
    const { values, onConflictDoUpdate } = setupInsertChain();

    await ensureClerkUser({ clerkUserId: 'user_1' });

    const insertValues = values.mock.calls[0][0];
    expect(insertValues).toEqual(
      expect.objectContaining({
        clerkUserId: 'user_1',
        updatedAt: expect.any(Date),
      }),
    );
    expect(insertValues.firstName).toBeUndefined();
    expect(insertValues.lastName).toBeUndefined();
    expect(insertValues.email).toBeUndefined();

    const conflictArgs = onConflictDoUpdate.mock.calls[0][0];
    expect(conflictArgs.set).toEqual(
      expect.objectContaining({
        updatedAt: expect.any(Date),
      }),
    );
    expect(conflictArgs.set.firstName).toBeUndefined();
    expect(conflictArgs.set.lastName).toBeUndefined();
    expect(conflictArgs.set.email).toBeUndefined();
  });

  it('upserts profile fields when they are provided', async () => {
    const { values, onConflictDoUpdate } = setupInsertChain();

    await ensureClerkUser({
      clerkUserId: 'user_1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    });

    const insertValues = values.mock.calls[0][0];
    expect(insertValues).toEqual(
      expect.objectContaining({
        clerkUserId: 'user_1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        updatedAt: expect.any(Date),
      }),
    );

    const conflictArgs = onConflictDoUpdate.mock.calls[0][0];
    expect(conflictArgs.set).toEqual(
      expect.objectContaining({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        updatedAt: expect.any(Date),
      }),
    );
  });
});
