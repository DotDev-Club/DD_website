import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectMongoDB from "@/lib/dbConnect";
import CycleModel from "@/models/Cycle";
import { requireAuth } from "@/lib/requireAuth";

export async function GET() {
  await connectMongoDB();
  try {
    const cycles = await CycleModel.find().sort({ startDate: -1 });
    return NextResponse.json({ cycles }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cycles", details: error instanceof Error ? error.message : "Unknown error" },
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
    const { name, description, week, squad, githubRepo, startDate, endDate, industryMentor, status, outcome } = body;

    if (!name || !startDate) {
      return NextResponse.json({ error: "name and startDate are required" }, { status: 400 });
    }

    const cycle = new CycleModel({
      id: uuidv4(),
      name,
      description: description ?? "",
      week: week ?? 1,
      squad: squad ?? [],
      githubRepo: githubRepo ?? "",
      startDate,
      endDate: endDate ?? "",
      industryMentor: industryMentor ?? "",
      status: status ?? "upcoming",
      outcome: outcome ?? "",
      dateCreated: new Date().toISOString(),
    });

    await cycle.save();
    return NextResponse.json({ cycle }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create cycle", details: error instanceof Error ? error.message : "Unknown error" },
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
    if (!id) return NextResponse.json({ error: "Cycle ID required" }, { status: 400 });

    const body = await request.json();
    const updated = await CycleModel.findOneAndUpdate({ id }, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Cycle not found" }, { status: 404 });

    return NextResponse.json({ cycle: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update cycle", details: error instanceof Error ? error.message : "Unknown error" },
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
    if (!id) return NextResponse.json({ error: "Cycle ID required" }, { status: 400 });

    const deleted = await CycleModel.findOneAndDelete({ id });
    if (!deleted) return NextResponse.json({ error: "Cycle not found" }, { status: 404 });

    return NextResponse.json({ message: "Cycle deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete cycle", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
