import { eq } from 'drizzle-orm';
import { db } from '../client';
import { clerkUsers } from '../schema';

export async function deleteClerkUser(clerkUserId: string): Promise<void> {
  await db.delete(clerkUsers).where(eq(clerkUsers.clerkUserId, clerkUserId));
}
