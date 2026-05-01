import { getAuthUserId } from '@/lib/mobile-auth';
import { db, homes } from '@org/db';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const myHomes = await db.select().from(homes).where(eq(homes.ownerId, userId));
    return NextResponse.json(myHomes);
  } catch (error) {
    console.error('Failed to fetch homes:', error);
    return NextResponse.json({ error: 'Failed to fetch homes' }, { status: 500 });
  }
}
