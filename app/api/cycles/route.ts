import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { getCycles, createCycle, updateCycle, archiveCycle } from "@/lib/notion";

export async function GET() {
  try {
    const cycles = await getCycles();
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

  try {
    const body = await request.json();
    const { name, description, week, squad, githubRepo, startDate, endDate, industryMentor, status, outcome } = body;

    if (!name || !startDate) {
      return NextResponse.json({ error: "name and startDate are required" }, { status: 400 });
    }

    const cycle = await createCycle({
      name,
      description: description ?? "",
      week: week ?? 1,
      squad: Array.isArray(squad) ? squad : [],
      githubRepo: githubRepo ?? "",
      startDate,
      endDate: endDate ?? "",
      industryMentor: industryMentor ?? "",
      status: status ?? "upcoming",
      outcome: outcome ?? "",
    });

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

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Cycle ID required" }, { status: 400 });

    const body = await request.json();
    const { squad, week, ...rest } = body;

    const cycle = await updateCycle(id, {
      ...rest,
      week: week ? Number(week) : undefined,
      squad: Array.isArray(squad) ? squad : undefined,
    });

    return NextResponse.json({ cycle }, { status: 200 });
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

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Cycle ID required" }, { status: 400 });

    await archiveCycle(id);
    return NextResponse.json({ message: "Cycle deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete cycle", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
