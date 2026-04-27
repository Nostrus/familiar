import 'dotenv/config';

import { createClerkClient } from '@clerk/nextjs/server';
import { sql } from 'drizzle-orm';
import { db } from './index';
import { clerkUsers } from './schema';

const clerkSecretKey = process.env.CLERK_SECRET_KEY;

if (!clerkSecretKey) {
  throw new Error('CLERK_SECRET_KEY is not set.');
}

const clerkClient = createClerkClient({ secretKey: clerkSecretKey });

function getPrimaryEmail(user: {
  primaryEmailAddressId: string | null;
  emailAddresses: Array<{ id: string; emailAddress: string }>;
}) {
  return (
    user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    null
  );
}

async function main() {
  const pageSize = 100;
  let offset = 0;
  let processed = 0;

  for (;;) {
    const page = await clerkClient.users.getUserList({
      limit: pageSize,
      offset,
      orderBy: '+created_at',
    });

    if (page.data.length === 0) {
      break;
    }

    const now = new Date();

    await db
      .insert(clerkUsers)
      .values(
        page.data.map((user) => ({
          clerkUserId: user.id,
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
          email: getPrimaryEmail(user),
          updatedAt: now,
        })),
      )
      .onConflictDoUpdate({
        target: clerkUsers.clerkUserId,
        set: {
          firstName: sql`excluded.first_name`,
          lastName: sql`excluded.last_name`,
          email: sql`excluded.email`,
          updatedAt: now,
        },
      });
    processed += page.data.length;
    offset += page.data.length;

    if (processed >= page.totalCount) {
      break;
    }
  }

  console.info(`Backfilled clerk_users profile fields for ${processed} users.`);
}

main().catch((error) => {
  console.error('Failed to backfill clerk_users profile fields.');
  console.error(error);
  process.exit(1);
});
