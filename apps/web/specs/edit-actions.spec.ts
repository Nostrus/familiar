/**
 * Critical security tests for home edit server actions.
 * Guards that auth and ownership are enforced before any mutation.
 */

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }));
jest.mock('@vercel/blob', () => ({ put: jest.fn() }));
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@org/db', () => ({
  updateOwnedHome: jest.fn(),
  addPhotosToHome: jest.fn(),
  removePhotoFromHome: jest.fn(),
}));

import { auth } from '@clerk/nextjs/server';
import { addPhotosToHome, updateOwnedHome } from '@org/db';
import { put } from '@vercel/blob';
import { updateHome, uploadHomePhoto } from '../src/app/homes/[id]/actions/edit-home';

const mockAuth = auth as unknown as jest.Mock;
const mockPut = put as jest.Mock;
const mockAddPhotosToHome = addPhotosToHome as jest.Mock;
const mockUpdateOwnedHome = updateOwnedHome as jest.Mock;

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
    await expect(updateHome(makeFormData({ homeId: 'abc' }))).rejects.toThrow('Invalid id');
    await expect(updateHome(makeFormData({ homeId: '-5' }))).rejects.toThrow('Invalid id');
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
    mockPut.mockResolvedValue({ url: 'https://blob.example/photo.jpg' });
    mockAddPhotosToHome.mockRejectedValue(new Error('Not your home'));

    const fd = new FormData();
    fd.append('homeId', '1');
    fd.append('photos', new File(['data'], 'photo.jpg', { type: 'image/jpeg' }));
    await expect(uploadHomePhoto(fd)).rejects.toThrow('Not your home');
  });

  it('throws when no file is provided', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    const fd = makeFormData({ homeId: '1' });
    await expect(uploadHomePhoto(fd)).rejects.toThrow('No file provided');
  });

  it('uploads file and returns urls', async () => {
    mockAuth.mockResolvedValue({ userId: 'u1' });
    mockAddPhotosToHome.mockResolvedValue(undefined);
    mockPut.mockResolvedValue({ url: 'https://blob.example/photo.jpg' });

    const fd = new FormData();
    fd.append('homeId', '1');
    fd.append('photos', new File(['data'], 'photo.jpg', { type: 'image/jpeg' }));
    const result = await uploadHomePhoto(fd);
    expect(result.urls).toEqual(['https://blob.example/photo.jpg']);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });
});
