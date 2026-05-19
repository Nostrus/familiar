'use server';

import { auth } from '@clerk/nextjs/server';
import { addPhotosToHome, removePhotoFromHome, updateOwnedHome } from '@org/db';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { parseId } from './_utils';

export async function updateHome(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not signed in.');

  const homeId = parseId(formData.get('homeId'));
  const description = String(formData.get('description') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const country = String(formData.get('country') ?? '').trim();
  const amenities = formData.getAll('amenities').map(String);

  await updateOwnedHome({
    homeId,
    ownerId: userId,
    description,
    city,
    country,
    amenities,
  });

  revalidatePath(`/homes/${homeId}`);
}

export async function uploadHomePhoto(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not signed in.');

  const homeId = parseId(formData.get('homeId'));

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

  await addPhotosToHome({ homeId, ownerId: userId, urls: uploadedUrls });

  revalidatePath(`/homes/${homeId}`);

  return { urls: uploadedUrls };
}

export async function removeHomePhoto(homeId: number, photoUrl: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not signed in.');

  await removePhotoFromHome({ homeId, ownerId: userId, photoUrl });

  revalidatePath(`/homes/${homeId}`);
}
