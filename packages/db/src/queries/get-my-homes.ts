import { eq } from 'drizzle-orm';
import { db } from '../client';
import { homes } from '../schema';

export async function getMyHomes(ownerId: string) {
  return db.select().from(homes).where(eq(homes.ownerId, ownerId));
}
