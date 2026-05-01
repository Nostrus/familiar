import { and, eq } from 'drizzle-orm';
import { db } from '../client';
import { homeFavorites } from '../schema';

type ToggleHomeFavoriteInput = {
  homeId: number;
  userId: string;
};

export async function toggleHomeFavorite({ homeId, userId }: ToggleHomeFavoriteInput) {
  const existingFavorite = await db
    .select({ id: homeFavorites.id })
    .from(homeFavorites)
    .where(and(eq(homeFavorites.homeId, homeId), eq(homeFavorites.userId, userId)))
    .limit(1);

  if (existingFavorite[0]) {
    await db.delete(homeFavorites).where(eq(homeFavorites.id, existingFavorite[0].id));
    return { isFavorited: false };
  }

  await db.insert(homeFavorites).values({ homeId, userId });
  return { isFavorited: true };
}
