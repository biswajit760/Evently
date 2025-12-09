import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',                     // homepage
  '/sign-in(.*)',          // Clerk signin page
  '/sign-up(.*)',          // Clerk signup page
  '/events(.*)',           // your events page
  '/api/webhook/clerk',    // webhook must be public
  '/api/webhook/stripe',   // optional
  '/api/uploadthing',      // optional
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) return;

  // Protect all other routes
  const session = await auth();

  if (!session.userId) {
    return new Response("Unauthorized", { status: 401 });
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
