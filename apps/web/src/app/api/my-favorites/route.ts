import { getAuthUserId } from '@/lib/mobile-auth';
import { getMyFavoriteHomes } from '@org/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const homes = await getMyFavoriteHomes(userId);
    return NextResponse.json(homes);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}
