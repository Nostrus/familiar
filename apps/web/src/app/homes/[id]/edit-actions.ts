'use server';

import { db } from '@org/db';
import { homes } from '@org/db';
import { auth } from '@clerk/nextjs/server';
import { put } from '@vercel/blob';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateHome(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not signed in.');

  const homeId = Number(formData.get('homeId'));
  if (!Number.isInteger(homeId) || homeId <= 0) throw new Error('Invalid home id.');

  const [home] = await db
    .select({ id: homes.id, ownerId: homes.ownerId })
    .from(homes)
    .where(eq(homes.id, homeId))
    .limit(1);

  if (!home) throw new Error('Home not found.');
  if (home.ownerId !== userId) throw new Error('Not your home.');

  const description = String(formData.get('description') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const country = String(formData.get('country') ?? '').trim();
  const amenities = formData.getAll('amenities').map(String);

  await db
    .update(homes)
    .set({ description, city, country, amenities, updatedAt: new Date() })
    .where(eq(homes.id, homeId));

  revalidatePath(`/homes/${homeId}`);
}

export async function uploadHomePhoto(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not signed in.');

  const homeId = Number(formData.get('homeId'));
  if (!Number.isInteger(homeId) || homeId <= 0) throw new Error('Invalid home id.');

  const [home] = await db
    .select({ id: homes.id, ownerId: homes.ownerId, photos: homes.photos })
    .from(homes)
    .where(eq(homes.id, homeId))
    .limit(1);

  if (!home) throw new Error('Home not found.');
  if (home.ownerId !== userId) throw new Error('Not your home.');

  const files = formData
    .getAll('photos')
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) {
    const fallbackFile = formData.get('photo');
    if (fallbackFile instanceof File && fallbackFile.size > 0) {
      files.push(fallbackFile);
    }
  }

  if (files.length === 0) throw new Error('No file provided.');

  const uploadedUrls: string[] = [];
  for (const file of files) {
    const blob = await put(`homes/${homeId}/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });
    uploadedUrls.push(blob.url);
  }

  await db
    .update(homes)
    .set({ photos: [...home.photos, ...uploadedUrls], updatedAt: new Date() })
    .where(eq(homes.id, homeId));

  revalidatePath(`/homes/${homeId}`);

  return { urls: uploadedUrls };
}

export async function removeHomePhoto(homeId: number, photoUrl: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not signed in.');

  const [home] = await db
    .select({ id: homes.id, ownerId: homes.ownerId, photos: homes.photos })
    .from(homes)
    .where(eq(homes.id, homeId))
    .limit(1);

  if (!home) throw new Error('Home not found.');
  if (home.ownerId !== userId) throw new Error('Not your home.');

  await db
    .update(homes)
    .set({ photos: home.photos.filter((p) => p !== photoUrl), updatedAt: new Date() })
    .where(eq(homes.id, homeId));

  revalidatePath(`/homes/${homeId}`);
}
