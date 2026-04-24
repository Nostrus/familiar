import 'server-only';

import { cache } from 'react';
import { getStayRequestsWithHome } from './get-stay-requests';

export const getMyStayRequests = cache(async (requesterId: string) => {
  return getStayRequestsWithHome({ requesterId });
});
