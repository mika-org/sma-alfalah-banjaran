import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "sma_alfalah_banjaran_jwt_secret_token_secure_2026";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const AUTH_COOKIE_NAME = "admin_token";
const ORTU_COOKIE_NAME = "ortu_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    let isAuthenticated = false;
    if (token) {
      try {
        await jwtVerify(token, SECRET_KEY);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    if (isLoginPage && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (!isLoginPage && !isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /ortu routes
  if (pathname.startsWith("/ortu")) {
    const isLoginPage = pathname === "/ortu/login";
    const token = request.cookies.get(ORTU_COOKIE_NAME)?.value;

    let isAuthenticated = false;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        if (payload && payload.isOrtu) {
          isAuthenticated = true;
        }
      } catch {
        isAuthenticated = false;
      }
    }

    if (isLoginPage && isAuthenticated) {
      return NextResponse.redirect(new URL("/ortu", request.url));
    }

    if (!isLoginPage && !isAuthenticated) {
      const loginUrl = new URL("/ortu/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/ortu/:path*"],
};

