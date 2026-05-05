import { getAuthUserId } from '@/lib/mobile-auth';
import { updateOwnedHome } from '@org/db';
import { NextRequest, NextResponse } from 'next/server';

type UpdateHomeBody = {
  description?: string;
  city?: string;
  country?: string;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  amenities?: string[];
};

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = await context.params;
  const homeId = Number(params.id);
  if (!Number.isInteger(homeId) || homeId <= 0) {
    return NextResponse.json({ error: 'Invalid home id' }, { status: 400 });
  }

  try {
    const body = (await request.json()) as UpdateHomeBody;

    const description = String(body.description ?? '').trim();
    const city = String(body.city ?? '').trim();
    const country = String(body.country ?? '').trim();
    const bedrooms = Number(body.bedrooms);
    const bathrooms = Number(body.bathrooms);
    const maxGuests = Number(body.maxGuests);
    const amenities = Array.isArray(body.amenities) ? body.amenities.map(String) : undefined;

    if (!city || !country) {
      return NextResponse.json({ error: 'City and country are required' }, { status: 400 });
    }

    if (
      !Number.isInteger(bedrooms) ||
      !Number.isInteger(bathrooms) ||
      !Number.isInteger(maxGuests) ||
      bedrooms <= 0 ||
      bathrooms <= 0 ||
      maxGuests <= 0
    ) {
      return NextResponse.json({ error: 'Invalid numeric values' }, { status: 400 });
    }

    const updatedHome = await updateOwnedHome({
      homeId,
      ownerId: userId,
      description,
      city,
      country,
      bedrooms,
      bathrooms,
      maxGuests,
      amenities,
    });

    return NextResponse.json(updatedHome);
  } catch (error) {
    if (error instanceof Error && error.message === 'Home not found') {
      return NextResponse.json({ error: 'Home not found' }, { status: 404 });
    }

    console.error('Failed to update home:', error);
    return NextResponse.json({ error: 'Failed to update home' }, { status: 500 });
  }
}
