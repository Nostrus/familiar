import { getAuthUserId } from '@/lib/mobile-auth';
import { getMyStayRequests } from '@org/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requests = await getMyStayRequests(userId);
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Failed to fetch requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
