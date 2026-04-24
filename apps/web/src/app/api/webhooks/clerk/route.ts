import { db } from '@/db';
import { clerkUsers } from '@/db/schema';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request);

    switch (event.type) {
      case 'user.created':
      case 'user.updated': {
        const clerkUserId = event.data.id;
        const firstName = event.data.first_name ?? null;
        const lastName = event.data.last_name ?? null;
        const primaryEmailAddressId = event.data.primary_email_address_id ?? null;
        const email =
          event.data.email_addresses?.find((entry) => entry.id === primaryEmailAddressId)
            ?.email_address ?? null;

        if (!clerkUserId) {
          return Response.json({ ok: true });
        }

        await db
          .insert(clerkUsers)
          .values({
            clerkUserId,
            firstName,
            lastName,
            email,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: clerkUsers.clerkUserId,
            set: {
              firstName,
              lastName,
              email,
              updatedAt: new Date(),
            },
          });

        break;
      }

      case 'user.deleted': {
        const clerkUserId = event.data.id;

        if (clerkUserId) {
          await db.delete(clerkUsers).where(eq(clerkUsers.clerkUserId, clerkUserId));
        }

        break;
      }

      default:
        break;
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Failed to verify Clerk webhook', error);
    return new Response('Invalid webhook signature', { status: 400 });
  }
}
