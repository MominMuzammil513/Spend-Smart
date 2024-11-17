import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isApiRoute = nextUrl.pathname.startsWith('/api');
  const isAuthRoute = nextUrl.pathname.startsWith('/login') || 
                     nextUrl.pathname.startsWith('/signup');

  if (isApiRoute) {
    return; // Allow API routes to handle their own auth
  }

  // If user is not logged in and trying to access protected route
  if (!isLoggedIn && !isAuthRoute) {
    return Response.redirect(new URL('/login', nextUrl));
  }

  // If user is logged in and trying to access auth routes
  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL('/', nextUrl));
  }

  return;
});

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - sign-in
     * - sign-up 
     */
    "/((?!.+\\.[\\w]+$|_next|api|sign-in|sign-up).*)",
    "/(api|trpc)(.*)"
  ]
};