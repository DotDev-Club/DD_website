import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectMongoDB from "@/lib/dbConnect";
import GalleryImageModel from "@/models/GalleryImage";
import { requireAuth } from "@/lib/requireAuth";

export async function GET() {
  await connectMongoDB();
  try {
    const images = await GalleryImageModel.find().sort({ uploadedAt: -1 });
    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch gallery", details: error instanceof Error ? error.message : "Unknown error" },
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
    const { imageUrl, caption, eventTag } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const image = new GalleryImageModel({
      id: uuidv4(),
      imageUrl,
      caption: caption ?? "",
      eventTag: eventTag ?? "",
      uploadedAt: new Date().toISOString(),
    });

    await image.save();
    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add image", details: error instanceof Error ? error.message : "Unknown error" },
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
    if (!id) return NextResponse.json({ error: "Image ID required" }, { status: 400 });

    const deleted = await GalleryImageModel.findOneAndDelete({ id });
    if (!deleted) return NextResponse.json({ error: "Image not found" }, { status: 404 });

    return NextResponse.json({ message: "Image deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete image", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
