import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/dbConnect";
import AdminUserModel from "@/models/AdminUser";
import { requireAuth } from "@/lib/requireAuth";

const SUPER_ADMIN = (process.env.SUPER_ADMIN_EMAIL ?? "rajasaipranav0@gmail.com").toLowerCase();

/** Seed the DB with emails from ADMIN_EMAILS env var if collection is empty. */
async function seedIfEmpty() {
  const count = await AdminUserModel.countDocuments();
  if (count === 0) {
    const envEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (envEmails.length > 0) {
      await AdminUserModel.insertMany(
        envEmails.map((email) => ({ email, addedAt: new Date().toISOString() }))
      );
    }
  }
}

export async function GET() {
  await connectMongoDB();
  await seedIfEmpty();
  const admins = await AdminUserModel.find({}).sort({ addedAt: 1 });
  return NextResponse.json(admins);
}

export async function POST(req: Request) {
  const { error, user } = await requireAuth();
  if (error) return error;

  // Only super admin can add new admins
  if (user!.email.toLowerCase() !== SUPER_ADMIN) {
    return NextResponse.json({ error: "Only the super admin can add admins" }, { status: 403 });
  }

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  await connectMongoDB();
  await seedIfEmpty();

  const exists = await AdminUserModel.findOne({ email: email.toLowerCase().trim() });
  if (exists) return NextResponse.json({ error: "Already an admin" }, { status: 409 });

  const admin = await AdminUserModel.create({
    email: email.toLowerCase().trim(),
    addedAt: new Date().toISOString(),
  });
  return NextResponse.json(admin, { status: 201 });
}

export async function DELETE(req: Request) {
  const { error, user } = await requireAuth();
  if (error) return error;

  // Only super admin can remove admins
  if (user!.email.toLowerCase() !== SUPER_ADMIN) {
    return NextResponse.json({ error: "Only the super admin can remove admins" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  // Super admin can never be removed
  if (email.toLowerCase() === SUPER_ADMIN) {
    return NextResponse.json({ error: "Super admin cannot be removed" }, { status: 403 });
  }

  await connectMongoDB();
  await AdminUserModel.deleteOne({ email: email.toLowerCase() });
  return NextResponse.json({ ok: true });
}
