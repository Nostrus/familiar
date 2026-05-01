import { getHome } from '@org/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const homeId = Number(id);
  if (!Number.isInteger(homeId) || homeId <= 0) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const home = await getHome(homeId);
  if (!home) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(home);
}
