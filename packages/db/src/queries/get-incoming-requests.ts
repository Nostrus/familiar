import type { IncomingStayRequest } from '@org/types';
import { getStayRequestsWithHomeAndRequester } from './get-stay-requests';

export async function getIncomingRequests(ownerId: string): Promise<IncomingStayRequest[]> {
  return getStayRequestsWithHomeAndRequester({ ownerId });
}
