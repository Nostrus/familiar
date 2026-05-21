'use server';

import { auth } from '@clerk/nextjs/server';
import { addPhotosToHome, removePhotoFromHome, updateOwnedHome } from '@org/db';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

const UpdateHomeSchema = z.object({
  homeId: z.coerce.number().int().positive(),
  description: z.string().max(2000).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  amenities: z.array(z.string().min(1)).optional(),
});

export async function updateHome(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not signed in.');

  const parsed = UpdateHomeSchema.parse({
    homeId: formData.get('homeId'),
    description: String(formData.get('description') ?? '').trim() || undefined,
    city: String(formData.get('city') ?? '').trim() || undefined,
    country: String(formData.get('country') ?? '').trim() || undefined,
    amenities: formData.getAll('amenities').map(String).filter(Boolean),
  });

  await updateOwnedHome({
    homeId: parsed.homeId,
    ownerId: userId,
    description: parsed.description ?? '',
    city: parsed.city ?? '',
    country: parsed.country ?? '',
    amenities: parsed.amenities ?? [],
  });

  revalidatePath(`/homes/${parsed.homeId}`);
}

const UploadHomePhotoSchema = z.object({
  homeId: z.coerce.number().int().positive(),
});

export async function uploadHomePhoto(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not signed in.');

  const { homeId } = UploadHomePhotoSchema.parse({ homeId: formData.get('homeId') });

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
