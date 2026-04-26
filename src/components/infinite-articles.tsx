"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicArticleListItem } from "@/lib/api";
import { ArticleCard } from "@/components/article-card";

const PAGE_SIZE = 9;
// Stop chasing pages that come back short — that's the natural end of the
// feed. Also a hard ceiling so a runaway loop can't burn the API.
const MAX_PAGES = 60;

export function InfiniteArticles({
  initial,
  initialOffset,
  topic,
  industry,
}: {
  initial: PublicArticleListItem[];
  initialOffset: number;
  topic?: string;
  industry?: string;
}) {
  const [items, setItems] = useState<PublicArticleListItem[]>(initial);
  const [offset, setOffset] = useState<number>(initialOffset);
  const [hasMore, setHasMore] = useState<boolean>(initial.length >= PAGE_SIZE);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const seenSlugs = useRef<Set<string>>(new Set(initial.map((a) => a.slug)));
  const pagesLoaded = useRef<number>(0);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    if (pagesLoaded.current >= MAX_PAGES) {
      setHasMore(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(offset));
      if (topic) params.set("topic", topic);
      if (industry) params.set("industry", industry);
      const r = await fetch(`/api/articles?${params.toString()}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const next = (await r.json()) as PublicArticleListItem[];
      // Filter dupes (defence against any backend reorder mid-scroll).
      const fresh = next.filter((a) => !seenSlugs.current.has(a.slug));
      fresh.forEach((a) => seenSlugs.current.add(a.slug));
      setItems((prev) => [...prev, ...fresh]);
      setOffset((prev) => prev + next.length);
      pagesLoaded.current += 1;
      if (next.length < PAGE_SIZE) setHasMore(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, topic, industry]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loadMore();
        }
      },
      { rootMargin: "600px 0px" }, // start loading well before the user hits the bottom
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      {/* Masonry via CSS columns. Each card avoids breaking across columns. */}
      <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
        {items.map((a) => (
          <div key={a.slug} className="mb-6 break-inside-avoid">
            <ArticleCard article={a} variant="standard" />
          </div>
        ))}
      </div>

      {/* Sentinel + status row */}
      <div ref={sentinelRef} className="mt-8 flex h-10 items-center justify-center">
        {loading && (
          <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Loading more …
          </span>
        )}
        {!loading && !hasMore && items.length > 0 && (
          <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            End of feed
          </span>
        )}
        {!loading && error && (
          <button
            type="button"
            onClick={loadMore}
            className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]"
          >
            Retry — {error}
          </button>
        )}
      </div>
    </>
  );
}
