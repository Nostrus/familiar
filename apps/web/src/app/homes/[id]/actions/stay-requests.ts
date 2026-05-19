'use server';

import { ensureClerkUser } from '@/lib/ensure-clerk-user';
import { auth } from '@clerk/nextjs/server';
import {
  cancelStayRequest,
  createStayRequest as dbCreateStayRequest,
  updateStayRequestStatus as dbUpdateStayRequestStatus,
} from '@org/db';
import { revalidatePath } from 'next/cache';
import { parseDate, parseId } from './_utils';

export async function createStayRequest(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in to request a stay.');
  }
  await ensureClerkUser({ clerkUserId: userId });

  const homeId = parseId(formData.get('homeId'));
  const requestedStartDate = parseDate(formData.get('requestedStartDate'));
  const requestedEndDate = parseDate(formData.get('requestedEndDate'));

  const todayStr = new Date().toISOString().split('T')[0];
  if (requestedStartDate < todayStr) {
    throw new Error('Start date cannot be in the past.');
  }
  if (requestedEndDate < todayStr) {
    throw new Error('End date cannot be in the past.');
  }
  if (requestedStartDate > requestedEndDate) {
    throw new Error('Requested start date must be before end date.');
  }

  await dbCreateStayRequest({ homeId, userId, requestedStartDate, requestedEndDate });

  revalidatePath(`/homes/${homeId}`);
  revalidatePath('/my-requests');
}

export async function updateStayRequestStatus(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in.');
  }
  await ensureClerkUser({ clerkUserId: userId });

  const homeId = parseId(formData.get('homeId'));
  const requestId = parseId(formData.get('requestId'));
  const nextStatus = formData.get('status');

  if (nextStatus !== 'approved' && nextStatus !== 'rejected') {
    throw new Error('Invalid status.');
  }

  await dbUpdateStayRequestStatus({ requestId, homeId, userId, nextStatus });

  revalidatePath(`/homes/${homeId}`);
}

export async function cancelMyStayRequest(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in.');
  }

  const requestId = parseId(formData.get('requestId'));

  const { homeId } = await cancelStayRequest({ requestId, userId });

  revalidatePath('/my-requests');
  revalidatePath(`/homes/${homeId}`);
}
