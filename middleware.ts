import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, hasValidAdminSession } from "./src/lib/admin-session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const hasSession = hasValidAdminSession(sessionValue);

  if (pathname.startsWith("/admin/login")) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
