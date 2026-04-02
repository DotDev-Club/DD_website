import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't need auth (sign-in page + magic link route)
const PUBLIC_ADMIN = ["/admin", "/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Protect /admin/* ────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const isPublic = PUBLIC_ADMIN.some((p) => pathname === p || pathname.startsWith("/admin/login"));
    if (!isPublic) {
      const token = request.cookies.get("admin_token")?.value;
      if (!token) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  // ── CORS for API routes ─────────────────────────────────────────────────────
  if (pathname.startsWith("/api")) {
    if (request.method === "OPTIONS") {
      return NextResponse.json(
        {},
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Max-Age": "86400",
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
