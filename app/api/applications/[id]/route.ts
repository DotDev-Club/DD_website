import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/dbConnect";
import ApplicationModel from "@/models/Application";
import { requireAuth } from "@/lib/requireAuth";

/** PATCH /api/applications/:id — update application status (admin only) */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAuth();
  if (error) return error;

  await connectMongoDB();
  try {
    const { status } = await request.json();
    const allowed = ["pending", "reviewed", "accepted", "rejected"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await ApplicationModel.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ application: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update application", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
