// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   callbacks: {
//     authorized: ({ token }) => !!token,
//   },
// });



import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) =>
      req.nextUrl.pathname?.slice(0, 5) === '/api/' ||
      req.nextUrl.pathname === '/login' ||
      !!token,
  }
});


// import type { NextAuthConfig } from "next-auth";

// export const authConfig = {
//   providers: [], // Add providers with the full auth config
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
//       if (isOnDashboard) {
//         if (isLoggedIn) return true;
//         return false; // Redirect unauthenticated users to login page
//       } else if (isLoggedIn) {
//         return Response.redirect(new URL('/dashboard', nextUrl));
//       }
//       return true;
//     },
//   },
// } satisfies NextAuthConfig; 


// import { auth } from "./auth";

// export default auth((req) => {
//   const isLoggedIn = !!req.auth;
//   const { nextUrl } = req;
//   const isApiRoute = nextUrl.pathname.startsWith('/api');
//   const isAuthRoute = nextUrl.pathname.startsWith('/login') || 
//                      nextUrl.pathname.startsWith('/signup');

//   if (isApiRoute) {
//     return; // Allow API routes to handle their own auth
//   }

//   // If user is not logged in and trying to access protected route
//   if (!isLoggedIn && !isAuthRoute) {
//     return Response.redirect(new URL('/login', nextUrl));
//   }

//   // If user is logged in and trying to access auth routes
//   if (isLoggedIn && isAuthRoute) {
//     return Response.redirect(new URL('/', nextUrl));
//   }

//   return;
// });

// export const config = {
//   matcher: [
//     /*
//      * Match all paths except:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public (public files)
//      * - sign-in
//      * - sign-up 
//      */
//     "/((?!.+\\.[\\w]+$|_next|api|sign-in|sign-up).*)",
//     "/(api|trpc)(.*)"
//   ]
// };