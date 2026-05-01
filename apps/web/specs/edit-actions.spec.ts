/**
 * Critical security tests for home edit server actions.
 * Guards that auth and ownership are enforced before any mutation.
 */

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }));
jest.mock('@vercel/blob', () => ({ put: jest.fn() }));
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@org/db', () => ({
  db: { select: jest.fn(), update: jest.fn() },
  homes: { id: 'id', ownerId: 'owner_id', photos: 'photos' },
  updateOwnedHome: jest.fn(),
}));

import { auth } from '@clerk/nextjs/server';
import { db, updateOwnedHome } from '@org/db';
import { put } from '@vercel/blob';
import { updateHome, uploadHomePhoto } from '../src/app/homes/[id]/edit-actions';

const mockAuth = auth as unknown as jest.Mock;
const mockPut = put as jest.Mock;
const mockDbSelect = db.select as jest.Mock;
const mockDbUpdate = db.update as jest.Mock;
const mockUpdateOwnedHome = updateOwnedHome as jest.Mock;

// Minimal drizzle chain builder
function chain(result: unknown) {
  const obj: Record<string, () => unknown> = {};
  ['select', 'from', 'where', 'limit', 'update', 'set'].forEach((m) => {
    obj[m] = () => (m === 'limit' ? Promise.resolve(result) : obj);
  });
  return obj;
}

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('updateHome', () => {
  it('throws when user is not signed in', async () => {
    mockAuth.mockResolvedValue({ userId: null });
    await expect(updateHome(makeFormData({ homeId: '1' }))).rejects.toThrow('Not signed in');
  });

  it('throws when homeId is not a positive integer', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    await expect(updateHome(makeFormData({ homeId: 'abc' }))).rejects.toThrow('Invalid home id');
    await expect(updateHome(makeFormData({ homeId: '-5' }))).rejects.toThrow('Invalid home id');
  });

  it('throws when the home is owned by a different user', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    mockUpdateOwnedHome.mockRejectedValue(new Error('Not your home'));
    await expect(
      updateHome(makeFormData({ homeId: '1', description: 'x', city: 'Paris', country: 'France' })),
    ).rejects.toThrow('Not your home');
  });
});

describe('uploadHomePhoto', () => {
  it('throws when user is not signed in', async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const fd = makeFormData({ homeId: '1' });
    await expect(uploadHomePhoto(fd)).rejects.toThrow('Not signed in');
  });

  it('throws when the home is owned by a different user', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    const c = chain([{ id: 1, ownerId: 'other_user', photos: [] }]);
    mockDbSelect.mockReturnValue(c);

    const fd = new FormData();
    fd.append('homeId', '1');
    fd.append('photos', new File(['data'], 'photo.jpg', { type: 'image/jpeg' }));
    await expect(uploadHomePhoto(fd)).rejects.toThrow('Not your home');
  });

  it('throws when no file is provided', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    const c = chain([{ id: 1, ownerId: 'u1', photos: [] }]);
    mockDbSelect.mockReturnValue(c);

    const fd = makeFormData({ homeId: '1' });
    await expect(uploadHomePhoto(fd)).rejects.toThrow('No file provided');
  });

  it('uploads file and returns urls', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    const selectChain = chain([{ id: 1, ownerId: 'u1', photos: [] }]);
    mockDbSelect.mockReturnValue(selectChain);

    // update chain: db.update(...).set(...).where(...) resolves
    const whereResolves = jest.fn().mockResolvedValue(undefined);
    const setReturns = jest.fn().mockReturnValue({ where: whereResolves });
    mockDbUpdate.mockReturnValue({ set: setReturns });

    mockPut.mockResolvedValue({ url: 'https://blob.example/photo.jpg' });

    const fd = new FormData();
    fd.append('homeId', '1');
    fd.append('photos', new File(['data'], 'photo.jpg', { type: 'image/jpeg' }));
    const result = await uploadHomePhoto(fd);
    expect(result.urls).toEqual(['https://blob.example/photo.jpg']);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });
});
