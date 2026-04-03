import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getPublishedPosts,
  getPostBySlug,
  getPageBlocks,
  parseRichText,
  type NotionBlock,
  type RichTextSegment,
} from "@/lib/notion";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — .Dev Blog`,
    description: post.summary,
  };
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

// ── Rich text renderer ─────────────────────────────────────────────────────────

function RichText({ segments }: { segments: RichTextSegment[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        let el: React.ReactNode = seg.text;
        if (seg.code)          el = <code key={i} className="font-mono bg-gray-900 text-green-300 px-1.5 py-0.5 rounded text-sm">{seg.text}</code>;
        else if (seg.bold)     el = <strong key={i} className="font-bold text-white">{seg.text}</strong>;
        else if (seg.italic)   el = <em key={i} className="italic">{seg.text}</em>;
        else if (seg.strikethrough) el = <s key={i}>{seg.text}</s>;
        else el = <span key={i}>{seg.text}</span>;

        if (seg.href && !seg.code) {
          return (
            <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer"
               className="text-green-400 hover:text-green-300 underline underline-offset-2 transition-colors">
              {el}
            </a>
          );
        }
        return el;
      })}
    </>
  );
}

// ── Block grouper (collapses consecutive list items) ──────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GroupedBlock = any;

function groupBlocks(blocks: NotionBlock[]): GroupedBlock[] {
  const grouped: GroupedBlock[] = [];
  for (const block of blocks) {
    if (block.type === "bulleted_list_item") {
      const last = grouped[grouped.length - 1];
      if (last && last.type === "bulleted_list") {
        last.items.push(block);
      } else {
        grouped.push({ type: "bulleted_list", items: [block] });
      }
    } else if (block.type === "numbered_list_item") {
      const last = grouped[grouped.length - 1];
      if (last && last.type === "numbered_list") {
        last.items.push(block);
      } else {
        grouped.push({ type: "numbered_list", items: [block] });
      }
    } else {
      grouped.push(block);
    }
  }
  return grouped;
}

// ── Block renderer ────────────────────────────────────────────────────────────

function Block({ block }: { block: GroupedBlock }) {
  if (block.type === "bulleted_list") {
    return (
      <ul className="list-disc pl-6 space-y-1 text-gray-300 text-base my-4">
        {block.items.map((item: NotionBlock) => (
          <li key={item.id}>
            <RichText segments={parseRichText(item.bulleted_list_item?.rich_text ?? [])} />
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "numbered_list") {
    return (
      <ol className="list-decimal pl-6 space-y-1 text-gray-300 text-base my-4">
        {block.items.map((item: NotionBlock) => (
          <li key={item.id}>
            <RichText segments={parseRichText(item.numbered_list_item?.rich_text ?? [])} />
          </li>
        ))}
      </ol>
    );
  }

  switch (block.type) {
    case "paragraph": {
      const rt = block.paragraph?.rich_text ?? [];
      if (!rt.length) return <div className="my-4" />;
      return (
        <p className="text-gray-300 text-base leading-relaxed my-4">
          <RichText segments={parseRichText(rt)} />
        </p>
      );
    }
    case "heading_1":
      return (
        <h1 className="text-2xl font-bold text-white mt-10 mb-4 font-mono">
          <RichText segments={parseRichText(block.heading_1?.rich_text ?? [])} />
        </h1>
      );
    case "heading_2":
      return (
        <h2 className="text-xl font-bold text-white mt-8 mb-3 font-mono">
          <RichText segments={parseRichText(block.heading_2?.rich_text ?? [])} />
        </h2>
      );
    case "heading_3":
      return (
        <h3 className="text-lg font-semibold text-white mt-6 mb-2 font-mono">
          <RichText segments={parseRichText(block.heading_3?.rich_text ?? [])} />
        </h3>
      );
    case "code": {
      const lang: string = block.code?.language ?? "";
      const code = parseRichText(block.code?.rich_text ?? []).map((s: RichTextSegment) => s.text).join("");
      return (
        <div className="my-6">
          <div className="flex items-center px-4 py-2 bg-gray-900 border border-gray-800 rounded-t-lg">
            {lang && <span className="font-mono text-xs text-green-600">{lang}</span>}
          </div>
          <pre className="bg-[#0d0d0d] border border-t-0 border-gray-800 rounded-b-lg p-4 overflow-x-auto">
            <code className="font-mono text-sm text-green-300">{code}</code>
          </pre>
        </div>
      );
    }
    case "quote":
      return (
        <blockquote className="border-l-2 border-green-500/40 pl-4 my-6 text-gray-400 italic">
          <RichText segments={parseRichText(block.quote?.rich_text ?? [])} />
        </blockquote>
      );
    case "callout": {
      const emoji: string = block.callout?.icon?.emoji ?? "💡";
      return (
        <div className="flex gap-3 my-6 p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
          <span className="text-lg shrink-0">{emoji}</span>
          <p className="text-gray-300 text-sm leading-relaxed">
            <RichText segments={parseRichText(block.callout?.rich_text ?? [])} />
          </p>
        </div>
      );
    }
    case "image": {
      const src: string = block.image?.type === "file"
        ? block.image.file?.url
        : block.image?.external?.url;
      const caption = parseRichText(block.image?.caption ?? []).map((s: RichTextSegment) => s.text).join("");
      if (!src) return null;
      return (
        <figure className="my-8">
          <div className="relative rounded-xl overflow-hidden border border-gray-800">
            <Image src={src} alt={caption || "Blog image"} width={800} height={450} className="w-full h-auto object-cover" unoptimized />
          </div>
          {caption && <figcaption className="text-center text-xs text-gray-600 font-mono mt-2">{caption}</figcaption>}
        </figure>
      );
    }
    case "divider":
      return <hr className="my-8 border-gray-800" />;
    default:
      return null;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const blocks = await getPageBlocks(post.id);
  const grouped = groupBlocks(blocks);

  return (
    <div className="min-h-screen pt-24 px-5 sm:px-8 pb-20 max-w-3xl mx-auto">
      <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs text-gray-500 hover:text-green-400 transition-colors mb-10">
        <ArrowLeft size={12} /> back to blog
      </Link>

      <article>
        <header className="mb-10">
          {post.category && (
            <span className="font-mono text-xs text-green-600 uppercase tracking-wider">{post.category}</span>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4 leading-tight">
            {post.title}
          </h1>
          {post.summary && (
            <p className="text-lg text-gray-400 leading-relaxed mb-6">{post.summary}</p>
          )}
          {post.date && (
            <p className="font-mono text-sm text-gray-600">{formatDate(post.date)}</p>
          )}
          <div className="mt-8 border-t border-gray-800" />
        </header>

        <div>
          {grouped.map((block, i) => (
            <Block key={"id" in block ? block.id : i} block={block} />
          ))}
        </div>
      </article>
    </div>
  );
}
