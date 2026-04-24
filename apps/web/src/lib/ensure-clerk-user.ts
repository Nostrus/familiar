import 'server-only';

import { db } from '@/db';
import { clerkUsers } from '@/db/schema';

type EnsureClerkUserInput = {
  clerkUserId: string | null | undefined;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

export async function ensureClerkUser({
  clerkUserId,
  firstName,
  lastName,
  email,
}: EnsureClerkUserInput) {
  if (!clerkUserId) return;

  await db
    .insert(clerkUsers)
    .values({
      clerkUserId,
      firstName: firstName ?? null,
      lastName: lastName ?? null,
      email: email ?? null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: clerkUsers.clerkUserId,
      set: {
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        email: email ?? null,
        updatedAt: new Date(),
      },
    });
}