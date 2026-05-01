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
 * Stay request with home details (returned from my-requests API)
 */
export interface StayRequestWithHome extends HomeStayRequest {
  homeDescription: string;
  homeCity: string;
  homeCountry: string;
}

/**
 * Incoming stay request for a home owner (returned from my-homes/requests API)
 */
export interface IncomingStayRequest extends HomeStayRequest {
  homeDescription: string;
  homeCity: string;
  homeCountry: string;
  requesterFirstName: string | null;
  requesterLastName: string | null;
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
