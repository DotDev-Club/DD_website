const GH_HEADERS = {
  Accept: "application/vnd.github+json",
};

const REVALIDATE = { next: { revalidate: 3600 } };

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "text-blue-400",
  JavaScript: "text-yellow-400",
  Python:     "text-green-400",
  Go:         "text-cyan-400",
  Rust:       "text-orange-400",
  Java:       "text-red-400",
  "C++":      "text-purple-400",
  C:          "text-blue-300",
  Shell:      "text-gray-400",
  HTML:       "text-orange-300",
  CSS:        "text-pink-400",
  Dart:       "text-sky-400",
  Swift:      "text-orange-500",
  Kotlin:     "text-violet-400",
};

export interface GitHubOrg {
  login: string;
  name: string;
  description: string;
  public_repos: number;
  followers: number;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  open_issues_count: number;
  topics: string[];
}

export interface GitHubIssue {
  title: string;
  html_url: string;
  number: number;
  repository_url: string;
  created_at: string;
}

export async function getOrgStats(): Promise<GitHubOrg | null> {
  try {
    const res = await fetch("https://api.github.com/orgs/DotDev-Club", {
      headers: GH_HEADERS,
      ...REVALIDATE,
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getOrgRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      "https://api.github.com/orgs/DotDev-Club/repos?sort=updated&type=public&per_page=12",
      { headers: GH_HEADERS, ...REVALIDATE }
    );
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();
    return repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } catch {
    return [];
  }
}

export async function getGoodFirstIssues(): Promise<GitHubIssue[]> {
  try {
    const res = await fetch(
      'https://api.github.com/search/issues?q=org:DotDev-Club+label:"good+first+issue"+state:open&per_page=10',
      { headers: GH_HEADERS, ...REVALIDATE }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}
