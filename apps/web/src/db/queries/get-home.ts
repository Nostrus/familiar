import 'server-only';

import { db } from '@/db';
import { homeAvailability, homeStayRequests, homes } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { cache } from 'react';
import { getStayRequests } from './get-stay-requests';

export const getHome = cache(async (id: number, viewerClerkUserId?: string) => {
  const home = await db.select().from(homes).where(eq(homes.id, id)).limit(1);
  if (!home[0]) return null;

  const isOwner = !!viewerClerkUserId && home[0].ownerId === viewerClerkUserId;

  const availability = await db
    .select({
      id: homeAvailability.id,
      startDate: homeAvailability.startDate,
      endDate: homeAvailability.endDate,
    })
    .from(homeAvailability)
    .where(eq(homeAvailability.homeId, id))
    .orderBy(homeAvailability.startDate);

  const viewerRequest = viewerClerkUserId
    ? await db
        .select({
          id: homeStayRequests.id,
          status: homeStayRequests.status,
          requestedStartDate: homeStayRequests.requestedStartDate,
          requestedEndDate: homeStayRequests.requestedEndDate,
          createdAt: homeStayRequests.createdAt,
        })
        .from(homeStayRequests)
        .where(
          and(eq(homeStayRequests.homeId, id), eq(homeStayRequests.requesterId, viewerClerkUserId)),
        )
        .orderBy(desc(homeStayRequests.createdAt))
        .limit(1)
    : [];

  const pendingRequestsForOwner = isOwner
    ? await getStayRequests({ homeId: id, status: 'pending' })
    : [];

  return {
    ...home[0],
    availability,
    viewerRequest: viewerRequest[0] ?? null,
    pendingRequestsForOwner,
  };
});
