import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Specify public routes
const publicRoutes = ["/login", "/register", "/"]; // Add any other public routes, like /forgot-password

// 2. Specify protected routes (matcher is usually more convenient for this)
// All other routes are considered protected by default if not in publicRoutes.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  // Prevent infinite redirect loop for login page
  if (pathname === "/login" && accessToken) {
    // If user is authenticated and tries to access login, redirect to dashboard
    // You might want to check token validity here if you have an endpoint for it,
    // but for simplicity, we assume presence means likely authenticated.
    // The actual page components will use useAuth to verify and handle user state.
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (pathname === "/login" && !accessToken) {
    // If user is not authenticated and on login page, allow access
    return NextResponse.next();
  }

  // If trying to access a protected route without a token, redirect to login
  if (!publicRoutes.includes(pathname) && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// 3. Configure the matcher to specify which routes the middleware should run on.
// This is often more efficient than checking pathname in the middleware function for all routes.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
