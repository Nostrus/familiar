import { eq } from 'drizzle-orm';
import { db } from '../client';
import { homes } from '../schema';

type RemovePhotoFromHomeInput = {
  homeId: number;
  ownerId: string;
  photoUrl: string;
};

export async function removePhotoFromHome({
  homeId,
  ownerId,
  photoUrl,
}: RemovePhotoFromHomeInput): Promise<void> {
  const [home] = await db
    .select({ id: homes.id, ownerId: homes.ownerId, photos: homes.photos })
    .from(homes)
    .where(eq(homes.id, homeId))
    .limit(1);

  if (!home) throw new Error('Home not found.');
  if (home.ownerId !== ownerId) throw new Error('Not your home.');

  await db
    .update(homes)
    .set({ photos: home.photos.filter((p: string) => p !== photoUrl), updatedAt: new Date() })
    .where(eq(homes.id, homeId));
}
