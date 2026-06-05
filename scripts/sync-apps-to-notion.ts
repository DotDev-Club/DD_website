/**
 * One-time script to sync existing MongoDB applications to Notion.
 * Run with: npx ts-node --project tsconfig.json -e "require('dotenv').config({path:'.env.local'})" scripts/sync-apps-to-notion.ts
 * Or simply: npm run sync-apps
 */

import { readFileSync } from "fs";
// Load .env.local manually
try {
  const env = readFileSync(".env.local", "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, "");
  }
} catch { /* already set */ }

import mongoose from "mongoose";

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const NOTION_APPS_DB = process.env.NOTION_APPS_DB!;
const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI!;

async function syncToNotion(app: {
  name: string;
  email: string;
  year: string;
  branch: string;
  whyJoin: string;
  skills: string;
  submittedAt: string;
  status: string;
}) {
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_APPS_DB },
      properties: {
        "Applicant Name": { title: [{ text: { content: app.name } }] },
        Email:            { email: app.email },
        Year:             { select: { name: app.year } },
        Branch:           { select: { name: app.branch } },
        "Why Join":       { rich_text: [{ text: { content: app.whyJoin } }] },
        Skills:           { rich_text: [{ text: { content: app.skills } }] },
        Status:           { select: { name: app.status } },
        "Applied On":     { date: { start: app.submittedAt.split("T")[0] } },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion error for ${app.email}: ${err}`);
  }
  return res.json();
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db!;
  const apps = await db.collection("devapplications").find({}).toArray();
  console.log(`Found ${apps.length} applications to sync`);

  for (const app of apps) {
    try {
      await syncToNotion({
        name: app.name,
        email: app.email,
        year: app.year,
        branch: app.branch,
        whyJoin: app.whyJoin,
        skills: app.skills,
        submittedAt: app.submittedAt || new Date().toISOString(),
        status: app.status || "pending",
      });
      console.log(`✓ Synced: ${app.name} (${app.email})`);
    } catch (err) {
      console.error(`✗ Failed: ${app.name} —`, err);
    }
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch(console.error);
