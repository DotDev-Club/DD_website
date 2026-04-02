import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectMongoDB from "@/lib/dbConnect";
import ProjectModel from "@/models/Project";
import { requireAuth } from "@/lib/requireAuth";

export async function GET() {
  await connectMongoDB();
  try {
    const projects = await ProjectModel.find().sort({ year: -1, featured: -1 });
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects", details: error instanceof Error ? error.message : "Unknown error" },
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
    const { name, description, techStack, domain, coverImage, liveUrl, githubUrl, teamMembers, year, featured } = body;

    if (!name || !description || !domain || !coverImage || !year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = new ProjectModel({
      id: uuidv4(),
      name,
      description,
      techStack: techStack ?? [],
      domain,
      coverImage,
      liveUrl: liveUrl ?? "",
      githubUrl: githubUrl ?? "",
      teamMembers: teamMembers ?? [],
      year,
      featured: featured ?? false,
    });

    await project.save();
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project", details: error instanceof Error ? error.message : "Unknown error" },
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
    if (!id) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

    const body = await request.json();
    const updated = await ProjectModel.findOneAndUpdate({ id }, body, { new: true });

    if (!updated) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ project: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project", details: error instanceof Error ? error.message : "Unknown error" },
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
    if (!id) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

    const deleted = await ProjectModel.findOneAndDelete({ id });
    if (!deleted) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
