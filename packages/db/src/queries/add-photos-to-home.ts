import { eq } from 'drizzle-orm';
import { db } from '../client';
import { homes } from '../schema';

type AddPhotosToHomeInput = {
  homeId: number;
  ownerId: string;
  urls: string[];
};

export async function addPhotosToHome({
  homeId,
  ownerId,
  urls,
}: AddPhotosToHomeInput): Promise<void> {
  const [home] = await db
    .select({ id: homes.id, ownerId: homes.ownerId, photos: homes.photos })
    .from(homes)
    .where(eq(homes.id, homeId))
    .limit(1);

  if (!home) throw new Error('Home not found.');
  if (home.ownerId !== ownerId) throw new Error('Not your home.');

  await db
    .update(homes)
    .set({ photos: [...home.photos, ...urls], updatedAt: new Date() })
    .where(eq(homes.id, homeId));
}
