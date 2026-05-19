import 'server-only';

import { upsertClerkUser } from '@org/db';

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

  await upsertClerkUser({ clerkUserId, firstName, lastName, email });
}
