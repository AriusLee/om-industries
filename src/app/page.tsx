import { listArticles, listTopics } from "@/lib/api";
import { ArticleCard } from "@/components/article-card";
import { InfiniteArticles } from "@/components/infinite-articles";
import { formatTopic } from "@/lib/format";
import Link from "next/link";

const INITIAL_PAGE = 21; // lead(1) + secondary(2) + compact(8) + masonry(10)

export default async function HomePage() {
  const [articles, topics] = await Promise.all([
    listArticles({ limit: INITIAL_PAGE }),
    listTopics(),
  ]);

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-[1240px] px-5 py-16">
        <h2 className="font-serif text-2xl font-bold tracking-tight">
          The desk is quiet.
        </h2>
        <p className="mt-3 max-w-prose text-[var(--muted-foreground)]">
          No articles have been published yet. Once an industry-expert report
          generates a citation, the article it references will appear here.
        </p>
      </div>
    );
  }

  const [lead, ...rest] = articles;
  const secondary = rest.slice(0, 2);
  const compact = rest.slice(2, 10);
  const masonryInitial = rest.slice(10);
  // Offset the infinite loader picks up from. Subsequent pages will skip
  // everything we already rendered above.
  const masonryOffset = 1 + secondary.length + compact.length + masonryInitial.length;

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div>
          <ArticleCard article={lead} variant="lead" />

          {secondary.length > 0 && (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {secondary.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="standard" />
              ))}
            </div>
          )}

          {masonryInitial.length > 0 && (
            <section className="mt-10">
              <SectionRule label="More from the desk" />
              <div className="mt-4">
                <InfiniteArticles
                  initial={masonryInitial}
                  initialOffset={masonryOffset}
                />
              </div>
            </section>
          )}
        </div>

        {/* Right rail — Bloomberg-style "most read"-equivalent + topic index */}
        <aside className="space-y-10 lg:sticky lg:top-6 lg:self-start">
          {compact.length > 0 && (
            <section>
              <SectionRule label="Latest" small />
              <div className="mt-2">
                {compact.map((a) => (
                  <ArticleCard key={a.slug} article={a} variant="compact" />
                ))}
              </div>
            </section>
          )}

          {topics.length > 0 && (
            <section>
              <SectionRule label="Topics" small />
              <ul className="mt-3 space-y-1.5">
                {pickRandom(topics, 5).map((t) => (
                  <li key={t}>
                    <Link
                      href={`/topics/${encodeURIComponent(t)}`}
                      className="cursor-pointer text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
                    >
                      {formatTopic(t)}
                      <span className="ml-1 text-[var(--muted-foreground)]">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {topics.length > 5 && (
                <Link
                  href="/topics"
                  className="mt-3 inline-block cursor-pointer text-[11px] font-semibold uppercase tracking-[0.18em] hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  Show all topics →
                </Link>
              )}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function SectionRule({ label, small = false }: { label: string; small?: boolean }) {
  return (
    <div className="flex items-center gap-3 border-t border-[var(--foreground)] pt-2">
      <span
        className={`font-semibold uppercase tracking-[0.18em] ${small ? "text-[10px]" : "text-[11px]"}`}
      >
        {label}
      </span>
    </div>
  );
}

// Fisher-Yates pick of n unique items. Runs server-side per request, so it
// shuffles each time the page revalidates (60s) — keeps the rail varied
// without any client-side JS.
function pickRandom<T>(items: T[], n: number): T[] {
  if (items.length <= n) return items;
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}
