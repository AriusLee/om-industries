import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[760px] px-5 py-20 text-center">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
        404
      </div>
      <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight">
        Article not found
      </h1>
      <p className="mt-3 text-[var(--muted-foreground)]">
        The article you are looking for has not been published, or its URL has
        changed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block cursor-pointer text-sm font-semibold uppercase tracking-[0.18em]"
        style={{ color: "var(--accent)" }}
      >
        ← Back to the desk
      </Link>
    </div>
  );
}
