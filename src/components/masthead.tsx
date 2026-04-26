import Link from "next/link";
import { listIndustries } from "@/lib/api";

export async function Masthead() {
  const industries = await listIndustries();

  return (
    <header className="border-b border-[var(--rule-strong)] bg-[var(--background)]">
      <div className="masthead-rule" />

      {/* Top utility bar: dateline + section markers */}
      <div className="border-b border-[var(--rule)]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          <span className="tabular">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="hidden md:flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--signal)" }}
            />
            <span>Independent research</span>
          </span>
        </div>
      </div>

      {/* Wordmark */}
      <div className="mx-auto max-w-[1240px] px-5 pt-7 pb-4 text-center">
        <Link
          href="/"
          className="inline-block cursor-pointer"
          aria-label="OM Industries home"
        >
          <h1
            className="font-serif font-bold tracking-[-0.02em] text-[clamp(2.4rem,5vw,3.6rem)] leading-none text-[var(--foreground)]"
          >
            OM <span className="italic font-normal">Industries</span>
          </h1>
          <div className="mt-1.5 text-[10px] uppercase tracking-[0.32em] text-[var(--muted-foreground)]">
            The Orionmano Research Imprint
          </div>
        </Link>
      </div>

      {/* Industry nav — sectors covered by the published corpus. */}
      <nav className="border-t border-[var(--rule)]">
        <div className="mx-auto flex max-w-[1240px] items-center gap-5 overflow-x-auto px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em]">
          <Link
            href="/"
            className="cursor-pointer whitespace-nowrap text-[var(--foreground)] hover:text-[var(--accent)]"
          >
            Latest
          </Link>
          {industries
            .filter((i) => i.slug !== "general")
            .map((i) => (
              <Link
                key={i.slug}
                href={`/industries/${encodeURIComponent(i.slug)}`}
                className="cursor-pointer whitespace-nowrap text-[var(--muted-foreground)] hover:text-[var(--accent)]"
              >
                {i.label}
              </Link>
            ))}
          <Link
            href="/about"
            className="ml-auto cursor-pointer whitespace-nowrap text-[var(--muted-foreground)] hover:text-[var(--accent)]"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
