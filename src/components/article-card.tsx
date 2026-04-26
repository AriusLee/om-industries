import Link from "next/link";
import { PublicArticleListItem } from "@/lib/api";
import { formatArticleDate, formatTopic, readingTimeLabel } from "@/lib/format";
import { HeroImage, pickHero } from "@/components/hero-image";

type Variant = "lead" | "standard" | "compact";

export function ArticleCard({
  article,
  variant = "standard",
}: {
  article: PublicArticleListItem;
  variant?: Variant;
}) {
  const date = formatArticleDate(article.article_date);
  const reading = readingTimeLabel(article.reading_time_minutes);
  const hasImage = !!article.hero_image_url;
  const hero = pickHero(article);

  if (variant === "lead") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group block cursor-pointer border-b border-[var(--rule)] pb-8"
      >
        {hasImage && (
          <HeroImage
            fields={hero}
            variant="card-lead"
            className="mb-5 w-full"
          />
        )}
        <TopicEyebrow topic={article.topic} />
        <h2 className="mt-2 font-serif text-[clamp(2rem,3.6vw,2.9rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--foreground)] group-hover:text-[var(--accent)]">
          {article.title}
        </h2>
        {article.deck && (
          <p className="mt-3 max-w-[58ch] font-serif text-lg leading-snug text-[var(--muted-foreground)]">
            {article.deck}
          </p>
        )}
        <Meta author={article.author} date={date} reading={reading} />
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex cursor-pointer items-start gap-3 border-b border-[var(--rule)] py-3 last:border-b-0"
      >
        {hasImage && (
          <HeroImage
            fields={hero}
            variant="card-compact"
            className="w-[72px] flex-shrink-0"
          />
        )}
        <div className="min-w-0 flex-1">
          <TopicEyebrow topic={article.topic} small />
          <h3 className="mt-1 font-serif text-[15px] font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--accent)]">
            {article.title}
          </h3>
          <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)] tabular">
            {date}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex cursor-pointer flex-col border-b border-[var(--rule)] pb-6"
    >
      {hasImage && (
        <HeroImage
          fields={hero}
          variant="card-standard"
          className="mb-4 w-full"
        />
      )}
      <TopicEyebrow topic={article.topic} />
      <h3 className="mt-2 font-serif text-2xl font-bold leading-[1.15] tracking-[-0.01em] text-[var(--foreground)] group-hover:text-[var(--accent)]">
        {article.title}
      </h3>
      {article.deck && (
        <p className="mt-2 font-serif text-[15px] leading-snug text-[var(--muted-foreground)]">
          {article.deck}
        </p>
      )}
      <Meta author={article.author} date={date} reading={reading} className="pt-3" />
    </Link>
  );
}

function TopicEyebrow({ topic, small = false }: { topic: string; small?: boolean }) {
  return (
    <div
      className={`uppercase tracking-[0.18em] ${small ? "text-[10px]" : "text-[11px]"} font-semibold`}
      style={{ color: "var(--accent)" }}
    >
      {formatTopic(topic)}
    </div>
  );
}

function Meta({
  author,
  date,
  reading,
  className = "",
}: {
  author: string;
  date: string;
  reading: string | null;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.14em] text-[var(--muted-foreground)] ${className}`}
    >
      <span className="font-medium text-[var(--foreground)]">By {author}</span>
      <span aria-hidden>·</span>
      <span className="tabular">{date}</span>
      {reading && (
        <>
          <span aria-hidden>·</span>
          <span className="tabular">{reading}</span>
        </>
      )}
    </div>
  );
}
