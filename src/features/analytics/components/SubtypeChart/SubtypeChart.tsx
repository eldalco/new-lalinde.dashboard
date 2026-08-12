"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmptyState } from "@/components/ui/EmptyState";

type SubtypeChartProps = {
  data: Array<{ name: string; count: number }>;
};

export function SubtypeChart({ data }: SubtypeChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="Sin subtipos"
        description="No hay datos de subtipo para graficar."
      />
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "var(--muted)" }}
            tickFormatter={(value: string) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--muted)" }} />
          <Tooltip
            formatter={(value) => [`${value ?? 0}`, "Apartamentos"]}
            contentStyle={{
              borderRadius: 8,
              borderColor: "var(--border)",
            }}
          />
          <Bar
            dataKey="count"
            fill="var(--primary)"
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
