import { and, eq } from 'drizzle-orm';
import { db } from '../client';
import { homeStayRequests, homes } from '../schema';

type UpdateStayRequestStatusInput = {
  requestId: number;
  homeId: number;
  userId: string;
  nextStatus: 'approved' | 'rejected';
};

export async function updateStayRequestStatus({
  requestId,
  homeId,
  userId,
  nextStatus,
}: UpdateStayRequestStatusInput) {
  const request = await db
    .select({
      id: homeStayRequests.id,
      homeId: homeStayRequests.homeId,
      status: homeStayRequests.status,
      ownerId: homes.ownerId,
    })
    .from(homeStayRequests)
    .innerJoin(homes, eq(homes.id, homeStayRequests.homeId))
    .where(and(eq(homeStayRequests.id, requestId), eq(homeStayRequests.homeId, homeId)))
    .limit(1);

  if (!request[0]) {
    throw new Error('Request not found.');
  }
  if (request[0].ownerId !== userId) {
    throw new Error('You are not allowed to update this request.');
  }
  if (request[0].status !== 'pending') {
    return;
  }

  await db
    .update(homeStayRequests)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(eq(homeStayRequests.id, requestId));
}
