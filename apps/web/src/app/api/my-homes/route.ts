import { getAuthUserId } from '@/lib/mobile-auth';
import { getMyHomes } from '@org/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const myHomes = await getMyHomes(userId);
    return NextResponse.json(myHomes);
  } catch (error) {
    console.error('Failed to fetch homes:', error);
    return NextResponse.json({ error: 'Failed to fetch homes' }, { status: 500 });
  }
}
