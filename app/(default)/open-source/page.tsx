import Image from "next/image";
import { Star, GitFork, ExternalLink, GitBranch, Users, AlertCircle } from "lucide-react";
import { getOrgStats, getOrgRepos, getGoodFirstIssues, LANGUAGE_COLORS } from "@/lib/github";

export const revalidate = 3600;

export const metadata = {
  title: "Open Source — .Dev Club",
  description: "Explore our open source repositories and contribute to .Dev projects.",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function repoFromUrl(url: string) {
  const parts = url.split("/repos/")[1]?.split("/") ?? [];
  return parts[1] ?? url;
}

export default async function OpenSourcePage() {
  const [org, repos, issues] = await Promise.all([
    getOrgStats(),
    getOrgRepos(),
    getGoodFirstIssues(),
  ]);

  return (
    <div className="min-h-screen pt-24 px-5 sm:px-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-green-500 text-sm mb-2">// we build in public</p>
        <h1 className="text-4xl font-bold text-white mb-3 font-mono">
          .open-source {"{"}<span className="text-green-400"> ▋</span>
        </h1>
        <p className="text-gray-500 font-mono text-sm">
          {"}"}{"  "}<span className="text-gray-700">// explore our repos. fork. contribute. build with us.</span>
        </p>
      </div>

      {/* Rate limit notice if no data */}
      {!org && repos.length === 0 && (
        <div className="mb-8 flex items-center gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
          <AlertCircle size={16} className="text-yellow-500 shrink-0" />
          <p className="text-sm text-yellow-600 font-mono">
            GitHub API rate limit reached. Data will refresh in ~1 hour.
          </p>
        </div>
      )}

      {/* Org header card */}
      {org && (
        <div className="mb-10 bg-[#111] border border-gray-800 rounded-xl p-6 bg-dots">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500/30 shrink-0">
              <Image src={org.avatar_url} alt={org.name ?? org.login} width={64} height={64} className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white mb-1">{org.name ?? org.login}</h2>
              {org.description && (
                <p className="text-sm text-gray-500 mb-4">{org.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 font-mono text-xs text-gray-500">
                  <GitBranch size={12} className="text-green-500" />
                  {org.public_repos} repositories
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-gray-500">
                  <Users size={12} className="text-green-500" />
                  {org.followers} followers
                </span>
                <a
                  href={org.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-mono text-xs text-green-500 hover:text-green-400 transition-colors"
                >
                  <ExternalLink size={12} />
                  github.com/DotDev-Club
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Repos grid */}
      {repos.length > 0 && (
        <div className="mb-12">
          <h2 className="font-mono text-sm text-green-600 mb-5">// repositories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover bg-[#111] border border-gray-800 rounded-xl p-5 hover:border-green-500/30 flex flex-col"
              >
                <div className="flex-1">
                  <p className="font-mono text-sm font-semibold text-white mb-1.5 truncate">
                    {repo.name}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                    {repo.description ?? "No description"}
                  </p>
                  {repo.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {repo.topics.slice(0, 3).map((t) => (
                        <span key={t} className="font-mono text-[9px] px-1.5 py-0.5 bg-green-500/5 border border-green-500/10 rounded text-green-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-900">
                  {repo.language && (
                    <span className={`flex items-center gap-1 font-mono text-[10px] ${LANGUAGE_COLORS[repo.language] ?? "text-gray-500"}`}>
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {repo.language}
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-gray-600 ml-auto">
                      <Star size={10} /> {repo.stargazers_count}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-gray-600">
                      <GitFork size={10} /> {repo.forks_count}
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-gray-700 ml-auto">
                    {timeAgo(repo.updated_at)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Good First Issues */}
      <div>
        <h2 className="font-mono text-sm text-green-600 mb-2">// good first issues</h2>
        <p className="font-mono text-xs text-gray-700 mb-5">perfect for your first contribution</p>
        {issues.length === 0 ? (
          <p className="font-mono text-gray-700 text-xs py-8 text-center">// no open good-first-issues right now — check back soon</p>
        ) : (
          <div className="space-y-2">
            {issues.map((issue) => (
              <a
                key={issue.html_url}
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-4 py-3 bg-[#111] border border-gray-800 rounded-lg hover:border-green-500/20 transition-colors group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1 line-clamp-1">
                  {issue.title}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-gray-900 border border-gray-800 rounded text-gray-600 shrink-0">
                  {repoFromUrl(issue.repository_url)}
                </span>
                <span className="font-mono text-[10px] text-gray-700 shrink-0">#{issue.number}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
