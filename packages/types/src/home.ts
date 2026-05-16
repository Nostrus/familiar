import type { PendingOwnerRequest, ViewerRequest } from './stay-request';

/**
 * Base Home entity from the database
 */
export interface Home {
  id: number;
  ownerId: string | null;
  cityId: number;
  city: string;
  country: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Home availability date range
 */
export interface HomeAvailability {
  id: number;
  homeId: number;
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Home with extended details including availability and requests
 */
export interface HomeWithDetails extends Home {
  availability: HomeAvailability[];
  viewerRequest: ViewerRequest | null;
  requestsForOwner: PendingOwnerRequest[];
  isFavorited: boolean;
}
