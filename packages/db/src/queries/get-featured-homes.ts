import 'server-only';

import type { Home } from '@org/types';
import { sql } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '../client';
import { homes } from '../schema';

export const getFeaturedHomes = cache(async (): Promise<Home[]> => {
  // Get 3 random homes using SQL ORDER BY RANDOM()
  return db
    .select()
    .from(homes)
    .orderBy(sql`random()`)
    .limit(3);
});
