'use server';

import { db } from '@/db';
import { homeStayRequests, homes } from '@/db/schema';
import { ensureClerkUser } from '@/lib/ensure-clerk-user';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

function parseId(value: FormDataEntryValue | null): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid id');
  }
  return id;
}

function parseDate(value: FormDataEntryValue | null): string {
  if (typeof value !== 'string' || !value) {
    throw new Error('Invalid date');
  }
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  return value;
}

export async function createStayRequest(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in to request a stay.');
  }
  await ensureClerkUser({ clerkUserId: userId });

  const homeId = parseId(formData.get('homeId'));
  const requestedStartDate = parseDate(formData.get('requestedStartDate'));
  const requestedEndDate = parseDate(formData.get('requestedEndDate'));

  if (requestedStartDate > requestedEndDate) {
    throw new Error('Requested start date must be before end date.');
  }

  const home = await db
    .select({ id: homes.id, ownerId: homes.ownerId })
    .from(homes)
    .where(eq(homes.id, homeId))
    .limit(1);

  if (!home[0]) {
    throw new Error('Home not found.');
  }
  if (!home[0].ownerId) {
    throw new Error('This home cannot receive requests yet.');
  }
  if (home[0].ownerId === userId) {
    throw new Error('You cannot request your own home.');
  }

  const existingPending = await db
    .select({ id: homeStayRequests.id })
    .from(homeStayRequests)
    .where(
      and(
        eq(homeStayRequests.homeId, homeId),
        eq(homeStayRequests.requesterId, userId),
        eq(homeStayRequests.status, 'pending'),
      ),
    )
    .limit(1);

  if (!existingPending[0]) {
    await db.insert(homeStayRequests).values({
      homeId,
      requesterId: userId,
      requestedStartDate,
      requestedEndDate,
      status: 'pending',
    });
  }

  revalidatePath(`/homes/${homeId}`);
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

  const request = await db
    .select({
      id: homeStayRequests.id,
      homeId: homeStayRequests.homeId,
      status: homeStayRequests.status,
      ownerId: homes.ownerId,
    })
    .from(homeStayRequests)
    .innerJoin(homes, eq(homes.id, homeStayRequests.homeId))
    .where(and(eq(homeStayRequests.id, requestId), eq(homeStayRequests.homeId, homeId)))
    .limit(1);

  if (!request[0]) {
    throw new Error('Request not found.');
  }
  if (request[0].ownerId !== userId) {
    throw new Error('You are not allowed to update this request.');
  }
  if (request[0].status !== 'pending') {
    revalidatePath(`/homes/${homeId}`);
    return;
  }

  await db
    .update(homeStayRequests)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(eq(homeStayRequests.id, requestId));

  revalidatePath(`/homes/${homeId}`);
}
