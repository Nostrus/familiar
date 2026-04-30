import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const protectedRoutePatterns = [
  '/my-profile(.*)',
  '/my-home(.*)',
  '/my-requests(.*)',
  '/my-favorites(.*)',
];

const publicApiRoutes = ['/api/featured-homes', '/api/cities', '/api/homes'];

const isProtectedRoute = createRouteMatcher(protectedRoutePatterns);
const isPublicApi = createRouteMatcher(publicApiRoutes);

export default clerkMiddleware(async (auth, req) => {
  // Skip Clerk auth entirely for public API routes
  if (isPublicApi(req)) {
    return;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
