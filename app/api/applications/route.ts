import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/dbConnect";
import ApplicationModel from "@/models/Application";

export async function GET() {
  await connectMongoDB();
  try {
    const applications = await ApplicationModel.find().sort({ submittedAt: -1 });
    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await connectMongoDB();
  try {
    const body = await request.json();
    const { name, email, year, branch, whyJoin, skills } = body;

    if (!name || !email || !year || !branch || !whyJoin || !skills) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const application = new ApplicationModel({
      name,
      email,
      year,
      branch,
      whyJoin,
      skills,
      submittedAt: new Date().toISOString(),
      status: "pending",
    });

    await application.save();
    return NextResponse.json({ message: "Application submitted successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit application", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
