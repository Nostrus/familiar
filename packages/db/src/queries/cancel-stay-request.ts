import { eq } from 'drizzle-orm';
import { db } from '../client';
import { homeStayRequests } from '../schema';

type CancelStayRequestInput = {
  requestId: number;
  userId: string;
};

export async function cancelStayRequest({ requestId, userId }: CancelStayRequestInput) {
  const request = await db
    .select({
      id: homeStayRequests.id,
      homeId: homeStayRequests.homeId,
      requesterId: homeStayRequests.requesterId,
      status: homeStayRequests.status,
    })
    .from(homeStayRequests)
    .where(eq(homeStayRequests.id, requestId))
    .limit(1);

  if (!request[0]) {
    throw new Error('Request not found.');
  }
  if (request[0].requesterId !== userId) {
    throw new Error('You are not allowed to cancel this request.');
  }

  const homeId = request[0].homeId;

  if (request[0].status === 'pending') {
    await db.delete(homeStayRequests).where(eq(homeStayRequests.id, requestId));
  }

  return { homeId };
}
