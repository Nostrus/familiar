import 'server-only';

import { db } from '../client';
import { homeFavorites, homes } from '../schema';
import { desc, eq } from 'drizzle-orm';
import { cache } from 'react';

export const getMyFavoriteHomes = cache(async (userId: string) => {
  return db
    .select({
      id: homes.id,
      ownerId: homes.ownerId,
      cityId: homes.cityId,
      city: homes.city,
      country: homes.country,
      description: homes.description,
      bedrooms: homes.bedrooms,
      bathrooms: homes.bathrooms,
      maxGuests: homes.maxGuests,
      amenities: homes.amenities,
      photos: homes.photos,
      createdAt: homes.createdAt,
      updatedAt: homes.updatedAt,
    })
    .from(homeFavorites)
    .innerJoin(homes, eq(homes.id, homeFavorites.homeId))
    .where(eq(homeFavorites.userId, userId))
    .orderBy(desc(homeFavorites.createdAt));
});
