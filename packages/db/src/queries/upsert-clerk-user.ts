import { db } from '../client';
import { clerkUsers } from '../schema';

type UpsertClerkUserInput = {
  clerkUserId: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

export async function upsertClerkUser({
  clerkUserId,
  firstName,
  lastName,
  email,
}: UpsertClerkUserInput): Promise<void> {
  const values: {
    clerkUserId: string;
    updatedAt: Date;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } = { clerkUserId, updatedAt: new Date() };

  const conflictSet: {
    updatedAt: Date;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } = { updatedAt: new Date() };

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
