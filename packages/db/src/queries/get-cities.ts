import 'server-only';

import type { CitySummary } from '@org/types';
import { desc } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '../client';
import { cities } from '../schema';

export const getCities = cache(
  async ({ limit }: { limit?: number } = {}): Promise<CitySummary[]> => {
    let query = db
      .select({
        city: cities.cityName,
        country: cities.country,
        homes: cities.listingCount,
        tagline: cities.cityDescription,
      })
      .from(cities)
      .orderBy(desc(cities.listingCount))
      .$dynamic();

    if (limit !== undefined && limit > 0) {
      query = query.limit(Math.floor(limit));
    }

    return query;
  },
);
