import { NextResponse } from "next/server";
import verifyAuth from "@/lib/client/verifyAuth";

export async function requireAuth() {
  try {
    const user = await verifyAuth();
    if (!user?.email) {
      return {
        error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }
    return { user };
  } catch {
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
}
