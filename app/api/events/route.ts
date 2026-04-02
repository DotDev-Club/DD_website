import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectMongoDB from "@/lib/dbConnect";
import EventModel from "@/models/Event";
import { requireAuth } from "@/lib/requireAuth";

export async function GET() {
  await connectMongoDB();
  try {
    const events = await EventModel.find().sort({ date: -1 });
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events", details: error instanceof Error ? error.message : "Unknown error" },
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
    const { title, description, date, type, bannerImage, registrationLink, status, venue } = body;

    if (!title || !description || !date || !type || !bannerImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const event = new EventModel({
      id: uuidv4(),
      title,
      description,
      date,
      type,
      bannerImage,
      registrationLink: registrationLink ?? "",
      status: status ?? "upcoming",
      venue: venue ?? "",
      dateCreated: now,
      dateModified: now,
    });

    await event.save();
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event", details: error instanceof Error ? error.message : "Unknown error" },
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
    if (!id) return NextResponse.json({ error: "Event ID required" }, { status: 400 });

    const body = await request.json();
    const updated = await EventModel.findOneAndUpdate(
      { id },
      { ...body, dateModified: new Date().toISOString() },
      { new: true }
    );

    if (!updated) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json({ event: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update event", details: error instanceof Error ? error.message : "Unknown error" },
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
    if (!id) return NextResponse.json({ error: "Event ID required" }, { status: 400 });

    const deleted = await EventModel.findOneAndDelete({ id });
    if (!deleted) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json({ message: "Event deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete event", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
