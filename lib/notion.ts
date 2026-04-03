import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// ── Database IDs ──────────────────────────────────────────────────────────────

export const NOTION_DB = {
  blogPosts: process.env.NOTION_BLOG_DB!,
  cycles:    process.env.NOTION_CYCLES_DB!,
  events:    process.env.NOTION_EVENTS_DB!,
  joinApps:  process.env.NOTION_APPS_DB!,
  partners:  process.env.NOTION_PARTNERS_DB!,
};

// ── Property helpers ──────────────────────────────────────────────────────────

type AnyProp = Record<string, unknown>;

function propRichText(prop: unknown): string {
  const p = prop as { rich_text?: { plain_text: string }[] } | null;
  return p?.rich_text?.map(r => r.plain_text).join("") ?? "";
}

function propTitle(prop: unknown): string {
  const p = prop as { title?: { plain_text: string }[] } | null;
  return p?.title?.map(r => r.plain_text).join("") ?? "";
}

function propSelect(prop: unknown): string {
  const p = prop as { select?: { name: string } | null } | null;
  return p?.select?.name ?? "";
}

function propCheckbox(prop: unknown): boolean {
  return (prop as { checkbox?: boolean } | null)?.checkbox ?? false;
}

function propDate(prop: unknown): string {
  return (prop as { date?: { start: string } | null } | null)?.date?.start ?? "";
}

function propUrl(prop: unknown): string {
  return (prop as { url?: string | null } | null)?.url ?? "";
}

function propEmail(prop: unknown): string {
  return (prop as { email?: string | null } | null)?.email ?? "";
}

function propNumber(prop: unknown): number {
  return (prop as { number?: number | null } | null)?.number ?? 0;
}

function propMultiSelect(prop: unknown): string[] {
  const p = prop as { multi_select?: { name: string }[] } | null;
  return p?.multi_select?.map(s => s.name) ?? [];
}

// ── Rich text renderer (returns annotated HTML-safe string segments) ───────────

export interface RichTextSegment {
  text: string;
  href?: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  strikethrough?: boolean;
}

export function parseRichText(items: RichTextItemResponse[]): RichTextSegment[] {
  return items.map(item => ({
    text: item.plain_text,
    href: item.href ?? undefined,
    bold: item.annotations.bold,
    italic: item.annotations.italic,
    code: item.annotations.code,
    strikethrough: item.annotations.strikethrough,
  }));
}

// ── Blog Posts ────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  summary: string;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const res = await notion.databases.query({
      database_id: NOTION_DB.blogPosts,
      filter: { property: "Published", checkbox: { equals: true } },
      sorts: [{ property: "Date", direction: "descending" }],
    });
    return res.results
      .filter((p): p is PageObjectResponse => "properties" in p)
      .map(p => {
        const props = p.properties as AnyProp;
        return {
          id: p.id,
          title: propTitle(props.Title),
          slug: propRichText(props.Slug),
          date: propDate(props.Date),
          category: propSelect(props.Category),
          summary: propRichText(props.Summary),
        };
      });
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await notion.databases.query({
      database_id: NOTION_DB.blogPosts,
      filter: {
        and: [
          { property: "Slug", rich_text: { equals: slug } },
          { property: "Published", checkbox: { equals: true } },
        ],
      },
    });
    const page = res.results.find((p): p is PageObjectResponse => "properties" in p);
    if (!page) return null;
    const props = page.properties as AnyProp;
    return {
      id: page.id,
      title: propTitle(props.Title),
      slug: propRichText(props.Slug),
      date: propDate(props.Date),
      category: propSelect(props.Category),
      summary: propRichText(props.Summary),
    };
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NotionBlock = BlockObjectResponse & { children?: NotionBlock[]; [key: string]: any };

export async function getPageBlocks(pageId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const block of res.results) {
      if (!("type" in block)) continue;
      const b = block as NotionBlock;
      if (b.has_children) {
        b.children = await getPageBlocks(b.id);
      }
      blocks.push(b);
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return blocks;
}

// ── Product Cycles ────────────────────────────────────────────────────────────
// Property names must match your Notion database columns exactly.
// Expected columns: Name (title), Description (rich_text), Week (number),
// Squad (multi_select), GitHubRepo (url), StartDate (date), EndDate (date),
// IndustryMentor (rich_text), Status (select), Outcome (rich_text)

export interface Cycle {
  id: string; // Notion page ID
  name: string;
  description: string;
  week: number;
  squad: string[];
  githubRepo: string;
  startDate: string;
  endDate: string;
  industryMentor: string;
  status: string;
  outcome: string;
}

function mapCyclePage(page: PageObjectResponse): Cycle {
  const p = page.properties as AnyProp;
  return {
    id: page.id,
    name: propTitle(p.Name),
    description: propRichText(p.Description),
    week: propNumber(p.Week),
    squad: propMultiSelect(p.Squad),
    githubRepo: propUrl(p.GitHubRepo),
    startDate: propDate(p.StartDate),
    endDate: propDate(p.EndDate),
    industryMentor: propRichText(p.IndustryMentor),
    status: propSelect(p.Status),
    outcome: propRichText(p.Outcome),
  };
}

export async function getCycles(): Promise<Cycle[]> {
  try {
    const res = await notion.databases.query({
      database_id: NOTION_DB.cycles,
      sorts: [{ property: "StartDate", direction: "descending" }],
    });
    return res.results
      .filter((p): p is PageObjectResponse => "properties" in p)
      .map(mapCyclePage);
  } catch {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildCycleProperties(data: Partial<Omit<Cycle, "id">>): Record<string, any> {
  const props: Record<string, unknown> = {};
  if (data.name !== undefined)
    props.Name = { title: [{ text: { content: data.name } }] };
  if (data.description !== undefined)
    props.Description = { rich_text: [{ text: { content: data.description } }] };
  if (data.week !== undefined)
    props.Week = { number: data.week };
  if (data.squad !== undefined)
    props.Squad = { multi_select: data.squad.map(s => ({ name: s })) };
  if (data.githubRepo !== undefined)
    props.GitHubRepo = { url: data.githubRepo || null };
  if (data.startDate !== undefined)
    props.StartDate = data.startDate ? { date: { start: data.startDate } } : { date: null };
  if (data.endDate !== undefined)
    props.EndDate = data.endDate ? { date: { start: data.endDate } } : { date: null };
  if (data.industryMentor !== undefined)
    props.IndustryMentor = { rich_text: [{ text: { content: data.industryMentor } }] };
  if (data.status !== undefined)
    props.Status = { select: { name: data.status } };
  if (data.outcome !== undefined)
    props.Outcome = { rich_text: [{ text: { content: data.outcome } }] };
  return props;
}

export async function createCycle(data: Omit<Cycle, "id">): Promise<Cycle> {
  const page = await notion.pages.create({
    parent: { database_id: NOTION_DB.cycles },
    properties: buildCycleProperties(data),
  }) as PageObjectResponse;
  return mapCyclePage(page);
}

export async function updateCycle(pageId: string, data: Partial<Omit<Cycle, "id">>): Promise<Cycle> {
  const page = await notion.pages.update({
    page_id: pageId,
    properties: buildCycleProperties(data),
  }) as PageObjectResponse;
  return mapCyclePage(page);
}

export async function archiveCycle(pageId: string): Promise<void> {
  await notion.pages.update({ page_id: pageId, archived: true });
}

// ── Join Applications ─────────────────────────────────────────────────────────
// Expected columns: Name (title), Email (email), Year (rich_text),
// Branch (rich_text), WhyJoin (rich_text), Skills (rich_text),
// Status (select), SubmittedAt (date)

export async function createApplicationInNotion(data: {
  name: string;
  email: string;
  year: string;
  branch: string;
  whyJoin: string;
  skills: string;
}): Promise<void> {
  await notion.pages.create({
    parent: { database_id: NOTION_DB.joinApps },
    properties: {
      Name:        { title: [{ text: { content: data.name } }] },
      Email:       { email: data.email },
      Year:        { rich_text: [{ text: { content: data.year } }] },
      Branch:      { rich_text: [{ text: { content: data.branch } }] },
      WhyJoin:     { rich_text: [{ text: { content: data.whyJoin } }] },
      Skills:      { rich_text: [{ text: { content: data.skills } }] },
      Status:      { select: { name: "pending" } },
      SubmittedAt: { date: { start: new Date().toISOString().split("T")[0] } },
    },
  });
}
