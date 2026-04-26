import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticle, listArticles } from "@/lib/api";
import { formatArticleDate, formatTopic, readingTimeLabel } from "@/lib/format";
import { ArticleBody } from "@/components/article-body";
import { KeyTakeaways } from "@/components/key-takeaways";
import { ArticleCard } from "@/components/article-card";
import { HeroImage, pickHero } from "@/components/hero-image";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.deck ?? undefined,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.deck ?? undefined,
      type: "article",
      publishedTime: article.article_date,
      authors: [article.author],
      siteName: "OM Industries",
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const date = formatArticleDate(article.article_date);
  const reading = readingTimeLabel(article.reading_time_minutes);
  const tags = article.topic_tags ?? [];
  const takeaways = article.key_takeaways ?? [];

  // Pull a few related articles from the same topic for the rail at the bottom.
  const related = (
    await listArticles({ topic: article.topic, limit: 6 })
  ).filter((a) => a.slug !== article.slug).slice(0, 4);

  return (
    <article className="mx-auto max-w-[1240px] px-5 py-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* Article */}
        <div className="max-w-[720px]">
          {article.hero_image_url && (
            <HeroImage
              fields={pickHero(article)}
              variant="article"
              className="mb-6"
            />
          )}

          <div className="mb-4">
            <Link
              href={`/topics/${encodeURIComponent(article.topic)}`}
              className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.22em] hover:underline"
              style={{ color: "var(--accent)" }}
            >
              {formatTopic(article.topic)}
            </Link>
          </div>

          <h1 className="font-serif text-[clamp(2.1rem,4.4vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--foreground)]">
            {article.title}
          </h1>

          {article.deck && (
            <p className="mt-4 max-w-[58ch] font-serif text-xl leading-snug text-[var(--muted-foreground)]">
              {article.deck}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[var(--rule)] py-3 text-[12px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--foreground)]">
              By {article.author}
            </span>
            <span aria-hidden>·</span>
            <span className="tabular">{date}</span>
            {reading && (
              <>
                <span aria-hidden>·</span>
                <span className="tabular">{reading}</span>
              </>
            )}
            <span className="ml-auto hidden md:inline tabular text-[var(--rule-strong)]">
              {article.publication}
            </span>
          </div>

          {takeaways.length > 0 && <KeyTakeaways items={takeaways} />}

          {article.body_md ? (
            <ArticleBody markdown={article.body_md} />
          ) : (
            <p className="mt-8 text-[var(--muted-foreground)]">
              This article is being prepared. Check back shortly.
            </p>
          )}

          {tags.length > 0 && (
            <div className="mt-12 border-t border-[var(--rule-strong)] pt-5">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Filed under
              </div>
              <ul className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li key={tag}>
                    <span
                      className="inline-block border border-[var(--rule)] px-2 py-0.5 text-[11px] uppercase tracking-[0.12em]"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right rail — related from same topic */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          {related.length > 0 ? (
            <section>
              <div className="border-t border-[var(--foreground)] pt-2 text-[10px] font-semibold uppercase tracking-[0.22em]">
                More on {formatTopic(article.topic)}
              </div>
              <div className="mt-2">
                {related.map((a) => (
                  <ArticleCard key={a.slug} article={a} variant="compact" />
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
