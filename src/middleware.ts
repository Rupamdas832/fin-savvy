import { NextRequest, NextResponse } from "next/server";
import { verify } from "./lib/jwt";

async function isAuthenticated(req: NextRequest) {
  try {
    const token = req.cookies.get("token");

    if (!token) {
      return false;
    }
    const jwt = await verify(token.value);

    if (!jwt || !jwt.payload.userId) {
      return false;
    }
    return true;
  } catch (err) {
    console.log("jwt error", err);
    return false;
  }
}

const publicRoutes = ["/login", "/signup"];

export async function middleware(req: any) {
  const requestedPathname = req.nextUrl.pathname;

  const isAuth = await isAuthenticated(req);

  if (publicRoutes.includes(requestedPathname) && isAuth === true) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } else if (!publicRoutes.includes(requestedPathname) && isAuth === false) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - static (static files)
     * - favicon.ico (favicon file)
     * - _next internal calls
     */
    "/((?!api|static|favicon.ico|_next).*)",
  ],
};
