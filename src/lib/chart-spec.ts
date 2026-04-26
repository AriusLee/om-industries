// Strict parser for chart specs embedded in article markdown as fenced
// `chart` code blocks. The schema is intentionally narrow so the model has
// few ways to produce a malformed exhibit. Anything that fails validation
// falls back to rendering the raw JSON in <pre>.

export type ChartType = "bar" | "line" | "pie";

export type ChartDatum = {
  x: string | number;
  y: number;
};

export type ChartSeries = {
  name: string;
  data: ChartDatum[];
};

export type ChartSpec = {
  type: ChartType;
  title: string;
  subtitle?: string;
  x_label?: string;
  y_label?: string;
  y_unit?: string;
  series: ChartSeries[];
  source: string;
};

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function asFiniteNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[, %$]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function asXValue(v: unknown): string | number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const s = asString(v);
  return s;
}

function parseSeries(raw: unknown): ChartSeries | null {
  if (!isObj(raw)) return null;
  const name = asString(raw.name);
  const dataRaw = raw.data;
  if (!name || !Array.isArray(dataRaw)) return null;
  const data: ChartDatum[] = [];
  for (const point of dataRaw) {
    if (!isObj(point)) continue;
    const x = asXValue(point.x);
    const y = asFiniteNumber(point.y);
    if (x === undefined || y === undefined) continue;
    data.push({ x, y });
  }
  if (data.length === 0) return null;
  return { name, data };
}

export function parseChartSpec(raw: string): ChartSpec | null {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isObj(json)) return null;

  const type = asString(json.type);
  if (type !== "bar" && type !== "line" && type !== "pie") return null;

  const title = asString(json.title);
  const source = asString(json.source);
  if (!title || !source) return null;

  const seriesRaw = json.series;
  if (!Array.isArray(seriesRaw)) return null;
  const series = seriesRaw.map(parseSeries).filter((s): s is ChartSeries => !!s);
  if (series.length === 0) return null;

  // For pie charts we require a single series and at least 2 slices.
  if (type === "pie") {
    if (series.length !== 1 || series[0].data.length < 2) return null;
  }

  return {
    type,
    title,
    subtitle: asString(json.subtitle),
    x_label: asString(json.x_label),
    y_label: asString(json.y_label),
    y_unit: asString(json.y_unit),
    series,
    source,
  };
}
