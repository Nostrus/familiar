import { and, eq } from 'drizzle-orm';
import { db } from '../client';
import { homeStayRequests, homes } from '../schema';

type CreateStayRequestInput = {
  homeId: number;
  userId: string;
  requestedStartDate: string;
  requestedEndDate: string;
};

export async function createStayRequest({
  homeId,
  userId,
  requestedStartDate,
  requestedEndDate,
}: CreateStayRequestInput) {
  const home = await db
    .select({ id: homes.id, ownerId: homes.ownerId })
    .from(homes)
    .where(eq(homes.id, homeId))
    .limit(1);

  if (!home[0]) {
    throw new Error('Home not found.');
  }
  if (!home[0].ownerId) {
    throw new Error('This home cannot receive requests yet.');
  }
  if (home[0].ownerId === userId) {
    throw new Error('You cannot request your own home.');
  }

  const existingPending = await db
    .select({ id: homeStayRequests.id })
    .from(homeStayRequests)
    .where(
      and(
        eq(homeStayRequests.homeId, homeId),
        eq(homeStayRequests.requesterId, userId),
        eq(homeStayRequests.status, 'pending'),
      ),
    )
    .limit(1);

  if (!existingPending[0]) {
    await db.insert(homeStayRequests).values({
      homeId,
      requesterId: userId,
      requestedStartDate,
      requestedEndDate,
      status: 'pending',
    });
  }
}
