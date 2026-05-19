jest.mock('@org/db', () => ({
  upsertClerkUser: jest.fn(),
}));

import { upsertClerkUser } from '@org/db';
import { ensureClerkUser } from '../src/lib/ensure-clerk-user';

const mockUpsertClerkUser = upsertClerkUser as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ensureClerkUser', () => {
  it('does nothing when clerkUserId is null', async () => {
    await ensureClerkUser({ clerkUserId: null });
    expect(mockUpsertClerkUser).not.toHaveBeenCalled();
  });

  it('passes undefined for omitted optional fields', async () => {
    mockUpsertClerkUser.mockResolvedValue(undefined);
    await ensureClerkUser({ clerkUserId: 'user_1' });
    expect(mockUpsertClerkUser).toHaveBeenCalledWith({
      clerkUserId: 'user_1',
      firstName: undefined,
      lastName: undefined,
      email: undefined,
    });
  });

  it('delegates to upsertClerkUser with all provided fields', async () => {
    mockUpsertClerkUser.mockResolvedValue(undefined);
    await ensureClerkUser({
      clerkUserId: 'user_1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    });
    expect(mockUpsertClerkUser).toHaveBeenCalledWith({
      clerkUserId: 'user_1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    });
  });
});
