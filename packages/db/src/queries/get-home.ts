import 'server-only';

import type { HomeWithDetails } from '@org/types';
import { and, desc, eq } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '../client';
import { homeAvailability, homeFavorites, homeStayRequests, homes } from '../schema';
import { getStayRequests } from './get-stay-requests';

export const getHome = cache(
  async (id: number, viewerClerkUserId?: string): Promise<HomeWithDetails | null> => {
    const home = await db.select().from(homes).where(eq(homes.id, id)).limit(1);
    if (!home[0]) return null;

    const isOwner = !!viewerClerkUserId && home[0].ownerId === viewerClerkUserId;

    const availability = await db
      .select({
        id: homeAvailability.id,
        homeId: homeAvailability.homeId,
        startDate: homeAvailability.startDate,
        endDate: homeAvailability.endDate,
        createdAt: homeAvailability.createdAt,
        updatedAt: homeAvailability.updatedAt,
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
            and(
              eq(homeStayRequests.homeId, id),
              eq(homeStayRequests.requesterId, viewerClerkUserId),
            ),
          )
          .orderBy(desc(homeStayRequests.createdAt))
          .limit(1)
      : [];

    const requestsForOwner = isOwner ? await getStayRequests({ homeId: id }) : [];

    const favorite = viewerClerkUserId
      ? await db
          .select({ id: homeFavorites.id })
          .from(homeFavorites)
          .where(and(eq(homeFavorites.homeId, id), eq(homeFavorites.userId, viewerClerkUserId)))
          .limit(1)
      : [];

    return {
      ...home[0],
      availability,
      isFavorited: !!favorite[0],
      viewerRequest: viewerRequest[0] ?? null,
      requestsForOwner,
    };
  },
);
