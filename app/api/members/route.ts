import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectMongoDB from "@/lib/dbConnect";
import MemberModel from "@/models/Member";
import { requireAuth } from "@/lib/requireAuth";

export async function GET() {
  try {
    await connectMongoDB();
    const members = await MemberModel.find().sort({ category: 1, name: 1 });
    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch members", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectMongoDB();
  try {
    const body = await request.json();
    const { name, role, category, photo, linkedin, github, batch, bio } = body;

    if (!name || !role || !category || !photo || !batch) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const member = new MemberModel({
      id: uuidv4(),
      name,
      role,
      category,
      photo,
      linkedin: linkedin ?? "",
      github: github ?? "",
      batch,
      bio: bio ?? "",
    });

    await member.save();
    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create member", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectMongoDB();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Member ID required" }, { status: 400 });

    const body = await request.json();
    const updated = await MemberModel.findOneAndUpdate({ id }, body, { new: true });

    if (!updated) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    return NextResponse.json({ member: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update member", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectMongoDB();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Member ID required" }, { status: 400 });

    const deleted = await MemberModel.findOneAndDelete({ id });
    if (!deleted) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    return NextResponse.json({ message: "Member deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete member", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
