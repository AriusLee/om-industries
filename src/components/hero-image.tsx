import Image from "next/image";
import type { HeroImageFields } from "@/lib/api";

type Variant = "article" | "card-lead" | "card-standard" | "card-compact";

// `sizes` hint for next/image so it generates correctly-sized srcsets.
const SIZES: Record<Variant, string> = {
  article: "(min-width: 1024px) 720px, 100vw",
  "card-lead": "(min-width: 1024px) 720px, 100vw",
  "card-standard": "(min-width: 1024px) 360px, 50vw",
  "card-compact": "120px",
};

export function HeroImage({
  fields,
  variant,
  className = "",
}: {
  fields: HeroImageFields;
  variant: Variant;
  className?: string;
}) {
  if (!fields.hero_image_url) return null;
  const sizes = SIZES[variant];
  const alt = fields.hero_image_alt || "";

  if (variant === "article") {
    return (
      <figure className={`relative w-full overflow-hidden ${className}`}>
        <div className="relative aspect-[16/9] w-full bg-[var(--surface-2)]">
          <Image
            src={fields.hero_image_url}
            alt={alt}
            fill
            priority
            sizes={sizes}
            className="object-cover"
          />
        </div>
        {fields.hero_image_credit && (
          <figcaption className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            Photo:{" "}
            {fields.hero_image_credit_url ? (
              <a
                href={fields.hero_image_credit_url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer underline-offset-2 hover:underline"
              >
                {fields.hero_image_credit}
              </a>
            ) : (
              <span>{fields.hero_image_credit}</span>
            )}{" "}
            / Unsplash
          </figcaption>
        )}
      </figure>
    );
  }

  const aspectClass =
    variant === "card-compact" ? "aspect-[4/3]" : "aspect-[16/10]";
  // For card variants the consumer always controls width via `className`
  // (e.g. `w-[72px]` on compact, `w-full` on standard/lead). Don't bake
  // `w-full` into the base — it silently overrides narrower widths.

  return (
    <div
      className={`relative overflow-hidden bg-[var(--surface-2)] ${aspectClass} ${className}`}
    >
      <Image
        src={fields.hero_image_url}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

export function pickHero<T extends HeroImageFields>(obj: T): HeroImageFields {
  return {
    hero_image_url: obj.hero_image_url,
    hero_image_alt: obj.hero_image_alt,
    hero_image_credit: obj.hero_image_credit,
    hero_image_credit_url: obj.hero_image_credit_url,
  };
}
