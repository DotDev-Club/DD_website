import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion";

export const revalidate = 300;

export const metadata = {
  title: "Blog — .Dev Club",
  description: "Insights, tutorials and announcements from the .Dev club.",
};

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function BlogPage({ searchParams }: { searchParams: { category?: string } }) {
  const posts = await getPublishedPosts();
  const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));
  const active = searchParams.category;
  const filtered = active ? posts.filter(p => p.category === active) : posts;

  return (
    <div className="min-h-screen pt-24 px-5 sm:px-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="font-mono text-green-500 text-sm mb-2">// ideas & insights</p>
        <h1 className="text-4xl font-bold text-white mb-3 font-mono">
          .blog {"{"}<span className="text-green-400"> ▋</span>
        </h1>
        <p className="text-gray-500 font-mono text-sm">
          {"}"}{" "}<span className="text-gray-700">// powered by notion</span>
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#111] border border-gray-800 flex items-center justify-center mb-2">
            <span className="font-mono text-xl text-green-500">✦</span>
          </div>
          <p className="font-mono text-gray-600 text-sm">// no posts yet</p>
          <p className="text-gray-700 text-xs text-center max-w-xs">
            Publish posts in your Notion workspace and they&apos;ll appear here automatically.
          </p>
        </div>
      ) : (
        <>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <Link
                href="/blog"
                className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  !active
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "border-gray-800 text-gray-500 hover:text-white hover:border-gray-700"
                }`}
              >
                All
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat}
                  href={`/blog?category=${encodeURIComponent(cat)}`}
                  className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    active === cat
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "border-gray-800 text-gray-500 hover:text-white hover:border-gray-700"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="card-hover group bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col hover:border-green-500/30"
              >
                {post.category && (
                  <span className="font-mono text-[10px] text-green-600 uppercase tracking-wider mb-3">
                    {post.category}
                  </span>
                )}
                <h2 className="text-base font-semibold text-white mb-2 group-hover:text-green-300 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.summary && (
                  <p className="text-sm text-gray-500 line-clamp-3 flex-1 mb-4">
                    {post.summary}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-900">
                  {post.date && (
                    <span className="font-mono text-xs text-gray-600">{formatDate(post.date)}</span>
                  )}
                  <span className="font-mono text-xs text-green-600 group-hover:text-green-400 transition-colors ml-auto">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
