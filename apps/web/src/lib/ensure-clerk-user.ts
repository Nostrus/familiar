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

  const values: {
    clerkUserId: string;
    updatedAt: Date;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } = {
    clerkUserId,
    updatedAt: new Date(),
  };

  const conflictSet: {
    updatedAt: Date;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } = {
    updatedAt: new Date(),
  };

  if (firstName !== undefined) {
    values.firstName = firstName ?? null;
    conflictSet.firstName = firstName ?? null;
  }

  if (lastName !== undefined) {
    values.lastName = lastName ?? null;
    conflictSet.lastName = lastName ?? null;
  }

  if (email !== undefined) {
    values.email = email ?? null;
    conflictSet.email = email ?? null;
  }

  await db.insert(clerkUsers).values(values).onConflictDoUpdate({
    target: clerkUsers.clerkUserId,
    set: conflictSet,
  });
}
