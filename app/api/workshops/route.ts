import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectMongoDB from "@/lib/dbConnect";
import WorkshopModel from "@/models/Workshop";
import { requireAuth } from "@/lib/requireAuth";

export async function GET() {
  await connectMongoDB();
  try {
    const workshops = await WorkshopModel.find().sort({ date: -1 });
    return NextResponse.json({ workshops }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch workshops", details: error instanceof Error ? error.message : "Unknown error" },
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
    const { title, facilitator, date, duration, description, resourcesLink, coverImage, tags } = body;

    if (!title || !facilitator || !date || !duration || !description || !coverImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const workshop = new WorkshopModel({
      id: uuidv4(),
      title,
      facilitator,
      date,
      duration,
      description,
      resourcesLink: resourcesLink ?? "",
      coverImage,
      tags: tags ?? [],
      dateCreated: new Date().toISOString(),
    });

    await workshop.save();
    return NextResponse.json({ workshop }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create workshop", details: error instanceof Error ? error.message : "Unknown error" },
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
    if (!id) return NextResponse.json({ error: "Workshop ID required" }, { status: 400 });

    const deleted = await WorkshopModel.findOneAndDelete({ id });
    if (!deleted) return NextResponse.json({ error: "Workshop not found" }, { status: 404 });

    return NextResponse.json({ message: "Workshop deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete workshop", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
