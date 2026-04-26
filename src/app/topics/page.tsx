import Link from "next/link";
import type { Metadata } from "next";
import { listTopics } from "@/lib/api";
import { formatTopic } from "@/lib/format";

export const metadata: Metadata = {
  title: "All topics",
  description: "Index of every topic with at least one published article on OM Industries.",
};

export default async function TopicsIndexPage() {
  const topics = await listTopics();

  // Group by first letter for a Bloomberg-style A-Z directory.
  const groups = new Map<string, string[]>();
  for (const t of topics) {
    const display = formatTopic(t);
    const key = (display[0] || "#").toUpperCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }
  const orderedKeys = Array.from(groups.keys()).sort();

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10">
      <div className="border-b border-[var(--rule-strong)] pb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Index
        </div>
        <h1 className="mt-1 font-serif text-[clamp(2.2rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em]">
          All topics
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {topics.length} topic{topics.length === 1 ? "" : "s"} with at least one published article.
        </p>
      </div>

      {topics.length === 0 ? (
        <p className="mt-10 text-[var(--muted-foreground)]">
          No published topics yet.
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {orderedKeys.map((letter) => (
            <section key={letter}>
              <div className="mb-3 flex items-baseline gap-3 border-b border-[var(--rule)] pb-1">
                <span className="font-serif text-2xl font-bold leading-none text-[var(--foreground)]">
                  {letter}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] tabular">
                  {groups.get(letter)!.length}
                </span>
              </div>
              <ul className="grid gap-x-6 gap-y-1.5 md:grid-cols-2 lg:grid-cols-3">
                {groups.get(letter)!.map((t) => (
                  <li key={t}>
                    <Link
                      href={`/topics/${encodeURIComponent(t)}`}
                      className="cursor-pointer text-[15px] font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
                    >
                      {formatTopic(t)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
