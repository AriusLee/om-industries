import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About OM Industries",
  description:
    "OM Industries is the public research imprint of Orionmano. We publish industry analyses that substantiate findings cited in our advisory work.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[760px] px-5 py-12">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
        About
      </div>
      <h1 className="mt-1 font-serif text-[clamp(2rem,3.6vw,2.8rem)] font-bold leading-tight tracking-[-0.02em]">
        The OM Industries Imprint
      </h1>

      <div className="article-prose mt-8">
        <p>
          OM Industries is the public research imprint of Orionmano. The imprint
          exists for one reason: every numerical claim that appears in an
          Orionmano advisory report should be traceable to a public, verifiable
          source — never a paid database or confidential file.
        </p>
        <p>
          When an Orionmano industry-expert report cites a fact, the footnote
          links here, to an article authored by an OM Industries analyst.
          Each article synthesises public information that supports the cited
          claim. Articles do not summarise paid databases. They do not reveal
          client information.
        </p>
        <h2>Editorial standards</h2>
        <p>
          Articles are written by named members of the research desk and
          reviewed before publication. We follow analytical-press conventions:
          numbers carry units and dates, qualifications are explicit, and
          forward-looking statements are flagged.
        </p>
        <h2>Corrections</h2>
        <p>
          If you spot an error, write to{" "}
          <a href="mailto:research@orionmano.com">research@orionmano.com</a>.
          We log all corrections.
        </p>
      </div>
    </div>
  );
}
