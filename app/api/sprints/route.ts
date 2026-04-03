import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/dbConnect";
import CycleModel from "@/models/Cycle";

export async function GET() {
  try {
    await connectMongoDB();
    const cycles = await CycleModel.find().sort({ startDate: -1 });

    const enriched = await Promise.all(
      cycles.map(async (cycle) => {
        const plain = cycle.toObject();
        if (!plain.githubRepo) return { ...plain, github: null };

        try {
          const match = plain.githubRepo.match(/github\.com\/([^/]+)\/([^/?#]+)/);
          if (!match) return { ...plain, github: null };

          const [, owner, repo] = match;
          const cleanRepo = repo.replace(/\.git$/, "").replace(/\/$/, "");

          const res = await fetch(
            `https://api.github.com/repos/${owner}/${cleanRepo}`,
            {
              headers: { Accept: "application/vnd.github+json" },
              next: { revalidate: 300 },
            }
          );
          if (!res.ok) return { ...plain, github: null };

          const data = await res.json();
          return {
            ...plain,
            github: {
              stars: data.stargazers_count,
              forks: data.forks_count,
              openIssues: data.open_issues_count,
              lastPush: data.pushed_at,
            },
          };
        } catch {
          return { ...plain, github: null };
        }
      })
    );

    return NextResponse.json(
      { cycles: enriched },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sprints", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
