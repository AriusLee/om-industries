import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { listArticles } from "@/lib/api";
import { formatTopic } from "@/lib/format";
import { ArticleCard } from "@/components/article-card";

type Params = Promise<{ topic: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { topic } = await params;
  return { title: `${formatTopic(decodeURIComponent(topic))} — Topic` };
}

export default async function TopicPage({ params }: { params: Params }) {
  const { topic } = await params;
  const slug = decodeURIComponent(topic).toLowerCase();
  const articles = await listArticles({ topic: slug, limit: 36 });

  if (articles.length === 0) notFound();

  const [lead, ...rest] = articles;

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10">
      <div className="border-b border-[var(--rule-strong)] pb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Topic
        </div>
        <h1 className="mt-1 font-serif text-[clamp(2.2rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em]">
          {formatTopic(slug)}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {articles.length} article{articles.length === 1 ? "" : "s"} from the OM Industries desk.
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <ArticleCard article={lead} variant="lead" />
          {rest.length > 0 && (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {rest.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="standard" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
