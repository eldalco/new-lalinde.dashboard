"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { EmptyState } from "@/components/ui/EmptyState";

type SalesStatusChartProps = {
  available: number;
  sold: number;
};

const COLORS = {
  available: "#067647",
  sold: "#b42318",
};

export function SalesStatusChart({ available, sold }: SalesStatusChartProps) {
  const data = [
    { name: "Disponibles", value: available, key: "available" as const },
    { name: "Vendidos", value: sold, key: "sold" as const },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <EmptyState title="Sin datos de estado" description="No hay apartamentos para graficar." />
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={58}
            outerRadius={86}
            paddingAngle={2}
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell key={entry.key} fill={COLORS[entry.key]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value ?? 0}`, "Cantidad"]}
            contentStyle={{
              borderRadius: 8,
              borderColor: "var(--border)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden />
          Disponibles ({available})
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger" aria-hidden />
          Vendidos ({sold})
        </span>
      </div>
    </div>
  );
}
