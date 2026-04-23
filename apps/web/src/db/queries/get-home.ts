import 'server-only';

import { db } from '@/db';
import { homeAvailability, homes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const getHome = cache(async (id: number) => {
  const home = await db.select().from(homes).where(eq(homes.id, id)).limit(1);
  if (!home[0]) return null;

  const availability = await db
    .select({
      id: homeAvailability.id,
      startDate: homeAvailability.startDate,
      endDate: homeAvailability.endDate,
    })
    .from(homeAvailability)
    .where(eq(homeAvailability.homeId, id))
    .orderBy(homeAvailability.startDate);

  return { ...home[0], availability };
});
