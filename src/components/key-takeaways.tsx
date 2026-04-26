export function KeyTakeaways({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <aside
      aria-label="Key takeaways"
      className="my-8 border-y border-[var(--rule-strong)] py-5"
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--signal)" }}
          aria-hidden
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]">
          Key takeaways
        </span>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="mt-[0.5em] inline-block h-px w-3 flex-shrink-0"
              style={{ background: "var(--accent)" }}
              aria-hidden
            />
            <span className="text-[15px] leading-snug text-[var(--foreground)]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
