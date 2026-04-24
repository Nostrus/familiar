import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const protectedRoutePatterns = [
  '/my-profile(.*)',
  '/my-home(.*)',
  '/my-requests(.*)',
  '/my-favorites(.*)',
];

const isProtectedRoute = createRouteMatcher(protectedRoutePatterns);

export default clerkMiddleware(async (auth, req) => {
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
