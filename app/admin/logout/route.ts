import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/** GET /admin/logout — clear session cookie and redirect to sign-in */
export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return NextResponse.redirect(new URL("/admin", request.url));
}
