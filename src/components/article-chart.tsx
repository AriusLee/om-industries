"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartSpec } from "@/lib/chart-spec";

// Bloomberg-restraint palette: a primary that matches the OM accent, a
// secondary signal tone, and a neutral progression for additional series.
const PALETTE = [
  "var(--accent)",
  "var(--signal)",
  "oklch(0.45 0.05 220)",
  "oklch(0.65 0.08 220)",
  "oklch(0.78 0.05 220)",
  "oklch(0.30 0.02 260)",
];

const AXIS_TICK_STYLE = {
  fill: "var(--muted-foreground)",
  fontSize: 11,
  fontFamily: "var(--font-sans)",
} as const;

const TOOLTIP_STYLE = {
  background: "var(--background)",
  border: "1px solid var(--rule-strong)",
  borderRadius: 0,
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  padding: "6px 10px",
  color: "var(--foreground)",
};

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  if (abs >= 100) return n.toFixed(0);
  if (abs >= 10) return n.toFixed(1);
  return n.toFixed(2);
}

export function ArticleChart({ spec }: { spec: ChartSpec }) {
  return (
    <figure className="my-7 border border-[var(--rule)] bg-[var(--surface)] p-5">
      <figcaption className="mb-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Exhibit
        </div>
        <h4 className="mt-1 font-serif text-[1.05rem] font-bold leading-tight text-[var(--foreground)]">
          {spec.title}
        </h4>
        {spec.subtitle && (
          <p className="mt-1 text-[12px] leading-snug text-[var(--muted-foreground)]">
            {spec.subtitle}
          </p>
        )}
      </figcaption>

      <div
        className={`w-full tabular ${spec.type === "pie" ? "h-[360px]" : "h-[280px]"}`}
      >
        <ResponsiveContainer>
          {spec.type === "bar" ? (
            <BarChartView spec={spec} />
          ) : spec.type === "line" ? (
            <LineChartView spec={spec} />
          ) : (
            <PieChartView spec={spec} />
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 border-t border-[var(--rule)] pt-2">
        {spec.y_unit && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            {spec.y_label
              ? `${spec.y_label} (${spec.y_unit})`
              : spec.y_unit}
          </span>
        )}
        <span className="ml-auto text-[10px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          Source: Orionmano Industries
        </span>
      </div>
    </figure>
  );
}

function BarChartView({ spec }: { spec: ChartSpec }) {
  const data = mergeSeriesByX(spec.series);
  return (
    <BarChart
      data={data}
      margin={{ top: 6, right: 12, left: 0, bottom: 4 }}
    >
      <CartesianGrid stroke="var(--rule)" vertical={false} />
      <XAxis
        dataKey="x"
        tick={AXIS_TICK_STYLE}
        tickLine={false}
        axisLine={{ stroke: "var(--rule-strong)" }}
      />
      <YAxis
        tick={AXIS_TICK_STYLE}
        tickLine={false}
        axisLine={false}
        tickFormatter={formatNumber}
        width={42}
      />
      <Tooltip
        contentStyle={TOOLTIP_STYLE}
        cursor={{ fill: "var(--muted)" }}
        formatter={(v) =>
          typeof v === "number"
            ? formatNumber(v) + (spec.y_unit ? ` ${spec.y_unit}` : "")
            : String(v ?? "")
        }
      />
      {spec.series.map((s, i) => (
        <Bar
          key={s.name}
          dataKey={s.name}
          fill={PALETTE[i % PALETTE.length]}
          radius={0}
          maxBarSize={48}
        />
      ))}
    </BarChart>
  );
}

function LineChartView({ spec }: { spec: ChartSpec }) {
  const data = mergeSeriesByX(spec.series);
  return (
    <LineChart
      data={data}
      margin={{ top: 6, right: 12, left: 0, bottom: 4 }}
    >
      <CartesianGrid stroke="var(--rule)" vertical={false} />
      <XAxis
        dataKey="x"
        tick={AXIS_TICK_STYLE}
        tickLine={false}
        axisLine={{ stroke: "var(--rule-strong)" }}
      />
      <YAxis
        tick={AXIS_TICK_STYLE}
        tickLine={false}
        axisLine={false}
        tickFormatter={formatNumber}
        width={42}
      />
      <Tooltip
        contentStyle={TOOLTIP_STYLE}
        formatter={(v) =>
          typeof v === "number"
            ? formatNumber(v) + (spec.y_unit ? ` ${spec.y_unit}` : "")
            : String(v ?? "")
        }
      />
      {spec.series.map((s, i) => (
        <Line
          key={s.name}
          type="monotone"
          dataKey={s.name}
          stroke={PALETTE[i % PALETTE.length]}
          strokeWidth={2}
          dot={{ r: 2.5, strokeWidth: 0, fill: PALETTE[i % PALETTE.length] }}
          activeDot={{ r: 4 }}
        />
      ))}
    </LineChart>
  );
}

function PieChartView({ spec }: { spec: ChartSpec }) {
  // Pie schema: single series, each `data` entry becomes a slice keyed by x.
  const slices = spec.series[0].data
    .slice()
    .sort((a, b) => b.y - a.y)
    .map((d) => ({ name: String(d.x), value: d.y }));
  const total = slices.reduce((acc, s) => acc + s.value, 0);

  return (
    // Margins reserve room for the external slice labels so they don't
    // collide with the figcaption above or the source line below.
    <PieChart margin={{ top: 28, right: 80, left: 80, bottom: 28 }}>
      <Pie
        data={slices}
        dataKey="value"
        nameKey="name"
        innerRadius="48%"
        outerRadius="72%"
        stroke="var(--background)"
        strokeWidth={2}
        label={({ name, value }) => {
          const pct = total ? ((Number(value) / total) * 100).toFixed(0) : "0";
          return `${name} ${pct}%`;
        }}
        labelLine={false}
        isAnimationActive={false}
      >
        {slices.map((_, i) => (
          <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={TOOLTIP_STYLE}
        formatter={(v) =>
          typeof v === "number"
            ? formatNumber(v) + (spec.y_unit ? ` ${spec.y_unit}` : "")
            : String(v ?? "")
        }
      />
    </PieChart>
  );
}

// Merge multi-series data so recharts can render them with a shared x-axis.
function mergeSeriesByX(series: ChartSpec["series"]): Record<string, string | number>[] {
  const xOrder: (string | number)[] = [];
  const seen = new Set<string>();
  for (const s of series) {
    for (const d of s.data) {
      const key = String(d.x);
      if (!seen.has(key)) {
        seen.add(key);
        xOrder.push(d.x);
      }
    }
  }
  return xOrder.map((x) => {
    const row: Record<string, string | number> = { x };
    for (const s of series) {
      const point = s.data.find((p) => String(p.x) === String(x));
      if (point) row[s.name] = point.y;
    }
    return row;
  });
}
