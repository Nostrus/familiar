/**
 * City entity from the database
 */
export interface City {
  id: number;
  cityName: string;
  country: string;
  cityDescription: string;
  listingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * City summary for API responses
 */
export interface CitySummary {
  city: string;
  country: string;
  homes: number;
  tagline: string;
}

/**
 * Homes grouped by city name
 */
export interface HomesByCity<T = any> {
  [city: string]: T[];
}
