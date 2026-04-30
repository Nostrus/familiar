/**
 * Home stay request status
 */
export type StayRequestStatus = 'pending' | 'approved' | 'rejected';

/**
 * Home stay request entity
 */
export interface HomeStayRequest {
  id: number;
  homeId: number;
  requesterId: string;
  requestedStartDate: string;
  requestedEndDate: string;
  status: StayRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Home favorite entity
 */
export interface HomeFavorite {
  id: number;
  homeId: number;
  userId: string;
  createdAt: Date;
}
