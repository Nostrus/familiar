import { and, eq } from 'drizzle-orm';
import { db } from '../client';
import { homes } from '../schema';

type UpdateOwnedHomeInput = {
  homeId: number;
  ownerId: string;
  description?: string;
  city?: string;
  country?: string;
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
};

export async function updateOwnedHome(input: UpdateOwnedHomeInput) {
  const [existingHome] = await db
    .select({ id: homes.id, ownerId: homes.ownerId })
    .from(homes)
    .where(and(eq(homes.id, input.homeId), eq(homes.ownerId, input.ownerId)))
    .limit(1);

  if (!existingHome) {
    throw new Error('Home not found');
  }

  const patch: Partial<typeof homes.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.description !== undefined) patch.description = input.description;
  if (input.city !== undefined) patch.city = input.city;
  if (input.country !== undefined) patch.country = input.country;
  if (input.amenities !== undefined) patch.amenities = input.amenities;
  if (input.bedrooms !== undefined) patch.bedrooms = input.bedrooms;
  if (input.bathrooms !== undefined) patch.bathrooms = input.bathrooms;
  if (input.maxGuests !== undefined) patch.maxGuests = input.maxGuests;

  const [updatedHome] = await db
    .update(homes)
    .set(patch)
    .where(eq(homes.id, input.homeId))
    .returning();

  return updatedHome;
}
