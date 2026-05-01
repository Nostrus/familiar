import { ensureClerkUser } from '@/lib/ensure-clerk-user';
import { getAuthUserId } from '@/lib/mobile-auth';
import { toggleHomeFavorite } from '@org/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { homeId?: number };
    const homeId = Number(body.homeId);

    if (!Number.isInteger(homeId) || homeId <= 0) {
      return NextResponse.json({ error: 'Invalid homeId' }, { status: 400 });
    }

    await ensureClerkUser({ clerkUserId: userId });

    const result = await toggleHomeFavorite({ homeId, userId });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}
