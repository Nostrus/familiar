import { eq } from 'drizzle-orm';
import { db } from '../client';
import { homes } from '../schema';

export async function getOwnedHomeId(ownerId: string): Promise<number | null> {
  const [row] = await db
    .select({ id: homes.id })
    .from(homes)
    .where(eq(homes.ownerId, ownerId))
    .limit(1);
  return row?.id ?? null;
}
