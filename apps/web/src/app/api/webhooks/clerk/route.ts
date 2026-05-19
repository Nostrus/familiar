import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { deleteClerkUser, upsertClerkUser } from '@org/db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const event = await verifyWebhook(request as Parameters<typeof verifyWebhook>[0]);

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

        await upsertClerkUser({ clerkUserId, firstName, lastName, email });

        break;
      }

      case 'user.deleted': {
        const clerkUserId = event.data.id;

        if (clerkUserId) {
          await deleteClerkUser(clerkUserId);
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
