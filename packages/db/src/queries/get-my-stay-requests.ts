import 'server-only';

import type { StayRequestWithHome } from '@org/types';
import { cache } from 'react';
import { getStayRequestsWithHome } from './get-stay-requests';

export const getMyStayRequests = cache(
  async (requesterId: string): Promise<StayRequestWithHome[]> => {
    return getStayRequestsWithHome({ requesterId });
  },
);
