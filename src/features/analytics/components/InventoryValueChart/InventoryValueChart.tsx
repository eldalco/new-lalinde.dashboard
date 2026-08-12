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

type InventoryValueChartProps = {
  availableValue: number;
  soldValue: number;
};

export function InventoryValueChart({
  availableValue,
  soldValue,
}: InventoryValueChartProps) {
  const data = [
    { name: "Disponible", value: availableValue },
    { name: "Vendido", value: soldValue },
  ];

  if (availableValue === 0 && soldValue === 0) {
    return (
      <EmptyState
        title="Sin valor de inventario"
        description="No hay precios para comparar."
      />
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted)" }} />
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
              "Valor",
            ]}
            contentStyle={{
              borderRadius: 8,
              borderColor: "var(--border)",
            }}
          />
          <Bar
            dataKey="value"
            fill="var(--accent)"
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
