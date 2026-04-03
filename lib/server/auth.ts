"use server";

import { Resend } from "resend";
import { redis } from "@/lib/redis";
import jwt from "jsonwebtoken";
import connectMongoDB from "@/lib/dbConnect";
import AdminUserModel from "@/models/AdminUser";

export type JwtPayload = {
  email: string;
  role: "admin";
};

/** Check if the email is allowed: first try MongoDB, fall back to env var. */
async function isAllowedEmail(email: string): Promise<boolean> {
  try {
    await connectMongoDB();
    const count = await AdminUserModel.countDocuments();
    if (count > 0) {
      const found = await AdminUserModel.findOne({ email: email.toLowerCase().trim() });
      return !!found;
    }
  } catch {
    // fall through to env var
  }
  // Fallback: env var
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

/** Send a 15-minute magic link to the given email if it is whitelisted. */
export async function sendVerificationEmail(to: string): Promise<boolean> {
  if (!(await isAllowedEmail(to))) return false;

  const token = jwt.sign(
    { email: to },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  const verificationLink = `${
    process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"
  }/admin/login?token=${token}`;

  // Store token in Redis so it can be invalidated after one use
  await redis.set(`admin_login_${to}`, token, { ex: 15 * 60 });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: ".Dev Admin <onboarding@resend.dev>",
      to,
      subject: ".Dev — Admin Login Link",
      html: `
        <div style="font-family:monospace;background:#0a0a0a;color:#fff;padding:32px;border-radius:8px;max-width:480px">
          <p style="color:#22c55e;font-size:20px;margin:0 0 16px">.Dev Admin</p>
          <p>Click the link below to sign in to the admin panel:</p>
          <a href="${verificationLink}"
             style="display:inline-block;margin:16px 0;padding:10px 24px;background:#22c55e;color:#000;border-radius:4px;text-decoration:none;font-weight:bold">
            Sign In to Admin Panel
          </a>
          <p style="color:#666;font-size:12px">This link expires in 15 minutes. If you did not request this, ignore this email.</p>
        </div>`,
      text: `Sign in to .Dev Admin Panel:\n\n${verificationLink}\n\nExpires in 15 minutes.`,
    });
  } catch (error) {
    console.error("Error sending magic link email:", error);
  }

  return true;
}

/** Verify the magic-link token, invalidate it, and return a session JWT. */
export async function verifyLoginToken(token: string): Promise<string | false> {
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const stored = await redis.get<string>(`admin_login_${payload.email}`);
    if (stored !== token) return false;

    // One-time use — delete from Redis immediately
    await redis.del(`admin_login_${payload.email}`);

    return jwt.sign(
      { email: payload.email, role: "admin" },
      process.env.SESSION_SECRET as string,
      { expiresIn: "1d" }
    );
  } catch {
    return false;
  }
}

/** Verify a session JWT (from admin_token cookie). */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    return jwt.verify(
      token,
      process.env.SESSION_SECRET as string
    ) as JwtPayload;
  } catch {
    return null;
  }
}
