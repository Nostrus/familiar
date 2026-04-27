import 'server-only';

import { db } from '../client';
import { clerkUsers, homeStayRequests, homes } from '../schema';
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

  let query = db
    .select({
      ...stayRequestBaseSelect,
      requesterFirstName: clerkUsers.firstName,
      requesterLastName: clerkUsers.lastName,
    })
    .from(homeStayRequests)
    .leftJoin(clerkUsers, eq(clerkUsers.clerkUserId, homeStayRequests.requesterId))
    .$dynamic();

  if (whereClause) {
    query = query.where(whereClause);
  }

  query = query.orderBy(desc(homeStayRequests.createdAt));

  if (typeof limit === 'number') {
    query = query.limit(limit);
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

  let query = db
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
    query = query.where(whereClause);
  }

  query = query.orderBy(desc(homeStayRequests.createdAt));

  if (typeof limit === 'number') {
    query = query.limit(limit);
  }

  return query;
}
