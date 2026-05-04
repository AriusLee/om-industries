import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleChart } from "@/components/article-chart";
import { parseChartSpec } from "@/lib/chart-spec";

// Splits the article body into the main editorial content and the trailing
// "Sources" block, so we can render the sources in a distinct, footnote-style
// section instead of as just another H2.
function splitBodyAndSources(md: string): { body: string; sources: string | null } {
  const re = /^(#{1,3})\s*sources\b\s*$/im;
  const match = md.match(re);
  if (!match || match.index === undefined) return { body: md, sources: null };
  return {
    body: md.slice(0, match.index).trimEnd(),
    sources: md.slice(match.index + match[0].length).trim(),
  };
}

function makeComponents(): Components {
  return {
    a: ({ href, children, ...rest }) => (
      <a
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...rest}
      >
        {children}
      </a>
    ),
    code: ({ className, children, ...rest }) => {
      // react-markdown sets className="language-chart" on fenced ```chart blocks.
      // Detect that here and render the structured chart instead of <pre><code>.
      const isChart =
        typeof className === "string" && /(^|\s)language-chart(\s|$)/.test(className);
      if (isChart) {
        const raw = String(children).trim();
        const spec = parseChartSpec(raw);
        if (spec) return <ArticleChart spec={spec} />;
      }
      return (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    },
  };
}

export function ArticleBody({ markdown }: { markdown: string }) {
  // Drop the trailing Sources block — articles are presented as Orionmano
  // Industries' own findings; external attributions are hidden from readers.
  const { body } = splitBodyAndSources(markdown);
  const components = makeComponents();

  return (
    <div className="article-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
