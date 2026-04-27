import 'server-only';

import { db } from '../client';
import { homes } from '../schema';
import { sql } from 'drizzle-orm';
import { cache } from 'react';

export const getFeaturedHomes = cache(async () => {
  // Get 3 random homes using SQL ORDER BY RANDOM()
  return db
    .select()
    .from(homes)
    .orderBy(sql`random()`)
    .limit(3);
});
