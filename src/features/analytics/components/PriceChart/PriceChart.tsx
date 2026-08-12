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
import { formatCOP } from "@/lib/utils/currency";

type PriceChartProps = {
  data: Array<{ aptoNumber: string; pricePerSqm: number }>;
};

export function PriceChart({ data }: PriceChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="Sin precios por m²"
        description="No hay datos suficientes para esta gráfica."
      />
    );
  }

  // Keep the chart readable: show all when small dataset (~31).
  const chartData = data.map((item) => ({
    name: item.aptoNumber,
    value: item.pricePerSqm,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 8, bottom: 48 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-35}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 10, fill: "var(--muted)" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            tickFormatter={(value: number) =>
              new Intl.NumberFormat("es-CO", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(value)
            }
          />
          <Tooltip
            formatter={(value) => [
              formatCOP(typeof value === "number" ? value : Number(value)),
              "Precio m²",
            ]}
            contentStyle={{
              borderRadius: 8,
              borderColor: "var(--border)",
            }}
          />
          <Bar
            dataKey="value"
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
