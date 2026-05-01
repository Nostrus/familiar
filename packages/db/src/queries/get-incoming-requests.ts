import { getStayRequestsWithHomeAndRequester } from './get-stay-requests';

export async function getIncomingRequests(ownerId: string) {
  return getStayRequestsWithHomeAndRequester({ ownerId });
}
