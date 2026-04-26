import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--rule-strong)] bg-[var(--surface)]">
      <div className="mx-auto max-w-[1240px] px-5 py-8 text-[12px] text-[var(--muted-foreground)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="font-serif text-base font-bold text-[var(--foreground)]">
              OM Industries
            </div>
            <p className="mt-1 max-w-md leading-relaxed">
              The public research imprint of Orionmano. Articles synthesise
              public information to substantiate findings cited in advisory
              reports.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <Link
              href="/about"
              className="cursor-pointer hover:text-[var(--accent)]"
            >
              About this imprint
            </Link>
            <span className="tabular">
              © {new Date().getFullYear()} Orionmano International Holdings
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
