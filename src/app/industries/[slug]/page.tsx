import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { listArticles, listIndustries } from "@/lib/api";
import { ArticleCard } from "@/components/article-card";
import { InfiniteArticles } from "@/components/infinite-articles";

type Params = Promise<{ slug: string }>;

const INITIAL_PAGE = 24;

async function findIndustry(slug: string) {
  const industries = await listIndustries();
  return industries.find((i) => i.slug === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const industry = await findIndustry(slug);
  if (!industry) return { title: "Industry not found" };
  return {
    title: industry.label,
    description: `${industry.count} article${industry.count === 1 ? "" : "s"} from OM Industries on ${industry.label}.`,
  };
}

export default async function IndustryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [industry, articles] = await Promise.all([
    findIndustry(slug),
    listArticles({ industry: slug, limit: INITIAL_PAGE }),
  ]);

  if (!industry) notFound();
  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-[1240px] px-5 py-16">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Sector
        </div>
        <h1 className="mt-1 font-serif text-[clamp(2.2rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em]">
          {industry.label}
        </h1>
        <p className="mt-3 text-[var(--muted-foreground)]">
          No articles published in this sector yet.
        </p>
      </div>
    );
  }

  const [lead, ...rest] = articles;
  const masonryInitial = rest;

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10">
      <div className="border-b border-[var(--rule-strong)] pb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Sector
        </div>
        <h1 className="mt-1 font-serif text-[clamp(2.2rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em]">
          {industry.label}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {industry.count} article{industry.count === 1 ? "" : "s"} from the OM Industries desk.
        </p>
      </div>

      <div className="mt-8">
        <ArticleCard article={lead} variant="lead" />
      </div>

      {masonryInitial.length > 0 && (
        <section className="mt-10">
          <InfiniteArticles
            initial={masonryInitial}
            initialOffset={articles.length}
            industry={slug}
          />
        </section>
      )}
    </div>
  );
}
