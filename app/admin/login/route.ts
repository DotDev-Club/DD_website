import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyLoginToken } from "@/lib/server/auth";

/** GET /admin/login?token=xxx — verify magic link, set session cookie, redirect */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const sessionToken = await verifyLoginToken(token ?? "");
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/admin?error=invalid", request.url));
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return NextResponse.redirect(new URL(`/admin/dashboard?token=${sessionToken}`, request.url));
}
