import 'server-only';

import { db } from '@/db';
import { homes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const getHome = cache(async (id: number) => {
  const home = await db.select().from(homes).where(eq(homes.id, id)).limit(1);
  return home[0] || null;
});
