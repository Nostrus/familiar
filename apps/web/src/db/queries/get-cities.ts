import 'server-only';

import { db } from '@/db';
import { cities } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { cache } from 'react';

export const getCities = cache(async ({ limit = 6 }) => {
  const safeLimit = limit > 0 ? Math.floor(limit) : 6;

  //add a 2 seconds delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return db
    .select({
      city: cities.cityName,
      country: cities.country,
      homes: cities.listingCount,
      tagline: cities.cityDescription,
    })
    .from(cities)
    .orderBy(desc(cities.listingCount))
    .limit(safeLimit);
});
