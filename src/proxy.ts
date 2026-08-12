import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIE, AUTH_PATHS } from "@/lib/auth/constants";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE.TOKEN)?.value;
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(token);

  if (pathname.startsWith(AUTH_PATHS.DASHBOARD) && !isAuthenticated) {
    const loginUrl = new URL(AUTH_PATHS.LOGIN, request.url);
    loginUrl.searchParams.set("expired", "1");
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === AUTH_PATHS.LOGIN && isAuthenticated) {
    return NextResponse.redirect(new URL(AUTH_PATHS.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
