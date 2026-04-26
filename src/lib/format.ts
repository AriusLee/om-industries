// Small formatting utilities shared by the reader pages.

export function formatArticleDate(iso: string): string {
  // Bloomberg-style dateline: "March 14, 2024"
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTopic(topic: string): string {
  return topic
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function readingTimeLabel(minutes: number | null): string | null {
  if (!minutes || minutes < 1) return null;
  return `${minutes} min read`;
}
