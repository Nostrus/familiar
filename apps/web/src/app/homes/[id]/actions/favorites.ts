'use server';

import { ensureClerkUser } from '@/lib/ensure-clerk-user';
import { auth } from '@clerk/nextjs/server';
import { toggleHomeFavorite } from '@org/db';
import { revalidatePath } from 'next/cache';
import { parseId } from './_utils';

export async function toggleFavorite(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in to save favorites.');
  }

  await ensureClerkUser({ clerkUserId: userId });

  const homeId = parseId(formData.get('homeId'));

  await toggleHomeFavorite({ homeId, userId });

  revalidatePath(`/homes/${homeId}`);
  revalidatePath('/my-favorites');
}
