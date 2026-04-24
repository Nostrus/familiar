import 'server-only';

import { db } from '@/db';
import { homeStayRequests, homes } from '@/db/schema';
import { and, desc, eq, type SQL } from 'drizzle-orm';

type StayRequestStatus = 'pending' | 'approved' | 'rejected';

type StayRequestFilters = {
  requesterId?: string;
  homeId?: number;
  status?: StayRequestStatus;
};

type GetStayRequestsInput = StayRequestFilters & {
  limit?: number;
};

const stayRequestBaseSelect = {
  id: homeStayRequests.id,
  homeId: homeStayRequests.homeId,
  requesterId: homeStayRequests.requesterId,
  status: homeStayRequests.status,
  requestedStartDate: homeStayRequests.requestedStartDate,
  requestedEndDate: homeStayRequests.requestedEndDate,
  createdAt: homeStayRequests.createdAt,
} as const;

export async function getStayRequests({
  requesterId,
  homeId,
  status,
  limit,
}: GetStayRequestsInput) {
  const filters: SQL[] = [];

  if (requesterId) {
    filters.push(eq(homeStayRequests.requesterId, requesterId));
  }
  if (homeId) {
    filters.push(eq(homeStayRequests.homeId, homeId));
  }
  if (status) {
    filters.push(eq(homeStayRequests.status, status));
  }

  const whereClause =
    filters.length === 0 ? undefined : filters.length === 1 ? filters[0] : and(...filters);

  const query = db.select(stayRequestBaseSelect).from(homeStayRequests).$dynamic();

  if (whereClause) {
    query.where(whereClause);
  }

  query.orderBy(desc(homeStayRequests.createdAt));

  if (typeof limit === 'number') {
    query.limit(limit);
  }

  return query;
}

export async function getStayRequestsWithHome({
  requesterId,
  homeId,
  status,
  limit,
}: GetStayRequestsInput) {
  const filters: SQL[] = [];

  if (requesterId) {
    filters.push(eq(homeStayRequests.requesterId, requesterId));
  }
  if (homeId) {
    filters.push(eq(homeStayRequests.homeId, homeId));
  }
  if (status) {
    filters.push(eq(homeStayRequests.status, status));
  }

  const whereClause =
    filters.length === 0 ? undefined : filters.length === 1 ? filters[0] : and(...filters);

  const query = db
    .select({
      ...stayRequestBaseSelect,
      homeDescription: homes.description,
      homeCity: homes.city,
      homeCountry: homes.country,
    })
    .from(homeStayRequests)
    .innerJoin(homes, eq(homes.id, homeStayRequests.homeId))
    .$dynamic();

  if (whereClause) {
    query.where(whereClause);
  }

  query.orderBy(desc(homeStayRequests.createdAt));

  if (typeof limit === 'number') {
    query.limit(limit);
  }

  return query;
}
