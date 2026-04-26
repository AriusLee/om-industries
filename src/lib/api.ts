// Public API client for the OM Industries reader site.
// All calls hit the public/* endpoints on the main Orionmano backend —
// no auth, only `published` articles ever come through.

const API_BASE = process.env.OM_API_URL ?? "http://localhost:3030";

export type HeroImageFields = {
  hero_image_url: string | null;
  hero_image_alt: string | null;
  hero_image_credit: string | null;
  hero_image_credit_url: string | null;
};

export type PublicArticleListItem = HeroImageFields & {
  slug: string;
  title: string;
  deck: string | null;
  author: string;
  publication: string;
  article_date: string;
  topic: string;
  topic_tags: string[] | null;
  industry: string | null;
  reading_time_minutes: number | null;
  url: string;
};

export type IndustryItem = {
  slug: string;
  label: string;
  count: number;
};

export type PublicArticleDetail = PublicArticleListItem & {
  key_takeaways: string[] | null;
  body_md: string | null;
  status: string;
};

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    // Public reader: tolerate brief staleness for performance.
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    if (res.status === 404) throw new NotFoundError(path);
    throw new Error(`API ${path} ${res.status}`);
  }
  return (await res.json()) as T;
}

export class NotFoundError extends Error {
  constructor(path: string) {
    super(`Not found: ${path}`);
    this.name = "NotFoundError";
  }
}

export async function listArticles(opts: {
  topic?: string;
  industry?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<PublicArticleListItem[]> {
  const params = new URLSearchParams();
  if (opts.topic) params.set("topic", opts.topic);
  if (opts.industry) params.set("industry", opts.industry);
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.offset) params.set("offset", String(opts.offset));
  const qs = params.toString();
  const path = `/api/v1/articles/public${qs ? `?${qs}` : ""}`;
  try {
    return await apiGet<PublicArticleListItem[]>(path);
  } catch {
    return [];
  }
}

export async function listTopics(): Promise<string[]> {
  try {
    return await apiGet<string[]>("/api/v1/articles/public/topics");
  } catch {
    return [];
  }
}

export async function listIndustries(): Promise<IndustryItem[]> {
  try {
    return await apiGet<IndustryItem[]>("/api/v1/articles/public/industries");
  } catch {
    return [];
  }
}

export async function getArticle(slug: string): Promise<PublicArticleDetail | null> {
  try {
    return await apiGet<PublicArticleDetail>(
      `/api/v1/articles/public/${encodeURIComponent(slug)}`
    );
  } catch (e) {
    if (e instanceof NotFoundError) return null;
    throw e;
  }
}
