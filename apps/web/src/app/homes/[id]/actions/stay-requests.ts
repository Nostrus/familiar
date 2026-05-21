'use server';

import { ensureClerkUser } from '@/lib/ensure-clerk-user';
import { auth } from '@clerk/nextjs/server';
import {
  cancelStayRequest,
  createStayRequest as dbCreateStayRequest,
  updateStayRequestStatus as dbUpdateStayRequestStatus,
} from '@org/db';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

const CreateStayRequestSchema = z
  .object({
    homeId: z.coerce.number().int().positive(),
    requestedStartDate: z.string().date(),
    requestedEndDate: z.string().date(),
  })
  .refine((d) => d.requestedStartDate <= d.requestedEndDate, {
    message: 'Requested start date must be before end date.',
  });

const UpdateStayRequestStatusSchema = z.object({
  homeId: z.coerce.number().int().positive(),
  requestId: z.coerce.number().int().positive(),
  status: z.enum(['approved', 'rejected']),
});

const CancelStayRequestSchema = z.object({
  requestId: z.coerce.number().int().positive(),
});

export async function createStayRequest(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in to request a stay.');
  }
  await ensureClerkUser({ clerkUserId: userId });

  const parsed = CreateStayRequestSchema.parse({
    homeId: formData.get('homeId'),
    requestedStartDate: formData.get('requestedStartDate'),
    requestedEndDate: formData.get('requestedEndDate'),
  });

  const todayStr = new Date().toISOString().split('T')[0];
  if (parsed.requestedStartDate < todayStr) {
    throw new Error('Start date cannot be in the past.');
  }
  if (parsed.requestedEndDate < todayStr) {
    throw new Error('End date cannot be in the past.');
  }

  await dbCreateStayRequest({
    homeId: parsed.homeId,
    userId,
    requestedStartDate: parsed.requestedStartDate,
    requestedEndDate: parsed.requestedEndDate,
  });

  revalidatePath(`/homes/${parsed.homeId}`);
  revalidatePath('/my-requests');
}

export async function updateStayRequestStatus(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in.');
  }
  await ensureClerkUser({ clerkUserId: userId });

  const parsed = UpdateStayRequestStatusSchema.parse({
    homeId: formData.get('homeId'),
    requestId: formData.get('requestId'),
    status: formData.get('status'),
  });

  await dbUpdateStayRequestStatus({
    requestId: parsed.requestId,
    homeId: parsed.homeId,
    userId,
    nextStatus: parsed.status,
  });

  revalidatePath(`/homes/${parsed.homeId}`);
}

export async function cancelMyStayRequest(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in.');
  }

  const { requestId } = CancelStayRequestSchema.parse({ requestId: formData.get('requestId') });

  const { homeId } = await cancelStayRequest({ requestId, userId });

  revalidatePath('/my-requests');
  revalidatePath(`/homes/${homeId}`);
}
