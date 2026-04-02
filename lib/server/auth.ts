"use server";

import { createTransport } from "nodemailer";
import { redis } from "@/lib/redis";
import jwt from "jsonwebtoken";

export type JwtPayload = {
  email: string;
  role: "admin";
};

/** Check if the email is in the ADMIN_EMAILS env variable (comma-separated). */
function isAllowedEmail(email: string): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

/** Send a 15-minute magic link to the given email if it is whitelisted. */
export async function sendVerificationEmail(to: string): Promise<boolean> {
  if (!isAllowedEmail(to)) return false;

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
    const transporter = createTransport({
      host: process.env.MAIL_SMTP,
      pool: true,
      port: parseInt((process.env.MAIL_SMTP_PORT || "465") as string),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      to,
      from: `.Dev Admin <${process.env.MAIL_USER}>`,
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
    // Still return true — token is in Redis, failure is only email delivery
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
