import { verifyToken } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export async function getAuthUserId(request: NextRequest): Promise<string | null> {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    // Omit authorizedParties entirely to skip the azp check for mobile tokens
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    return payload.sub;
  } catch (err) {
    console.error('[mobile-auth] verifyToken failed:', err);
    return null;
  }
}
