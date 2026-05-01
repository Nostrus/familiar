import { getAuthUserId } from '@/lib/mobile-auth';
import { cancelStayRequest } from '@org/db';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const requestId = Number(id);
  if (!Number.isInteger(requestId) || requestId <= 0) {
    return NextResponse.json({ error: 'Invalid request id' }, { status: 400 });
  }

  try {
    await cancelStayRequest({ requestId, userId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to cancel stay request:', error);
    return NextResponse.json({ error: 'Failed to cancel stay request' }, { status: 400 });
  }
}
