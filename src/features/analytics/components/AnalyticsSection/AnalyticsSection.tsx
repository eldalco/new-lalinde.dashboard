"use client";

import type { ReactNode } from "react";

import {
  StatsCard,
  StatsCardSkeleton,
} from "@/features/analytics/components/StatsCard/StatsCard";
import { InventoryValueChart } from "@/features/analytics/components/InventoryValueChart/InventoryValueChart";
import { PriceChart } from "@/features/analytics/components/PriceChart/PriceChart";
import { SalesStatusChart } from "@/features/analytics/components/SalesStatusChart/SalesStatusChart";
import { SubtypeChart } from "@/features/analytics/components/SubtypeChart/SubtypeChart";
import { useApartmentAnalytics } from "@/features/analytics/hooks/useApartmentAnalytics";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatCOP, formatCOPPerSqm } from "@/lib/utils/currency";
import { formatPercent } from "@/lib/utils/numbers";
import { getUserFacingErrorMessage } from "@/lib/api/api-error";

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow-sm)] sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

export function AnalyticsSection() {
  const { analytics, isLoading, isError, error, refetch } =
    useApartmentAnalytics();

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Analítica</h2>
          <p className="text-sm text-muted">Calculando indicadores…</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <StatsCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="No se pudo calcular la analítica"
        message={getUserFacingErrorMessage(error)}
        action={
          <Button variant="secondary" onClick={() => void refetch()}>
            Reintentar
          </Button>
        }
      />
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Analítica</h2>
        <p className="text-sm text-muted">
          Indicadores derivados del inventario actual.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total apartamentos" value={String(analytics.total)} />
        <StatsCard label="Disponibles" value={String(analytics.available)} />
        <StatsCard label="Vendidos" value={String(analytics.sold)} />
        <StatsCard
          label="Porcentaje vendido"
          value={formatPercent(analytics.soldPercent)}
        />
        <StatsCard
          label="Valor total inventario"
          value={formatCOP(analytics.inventoryValue)}
        />
        <StatsCard
          label="Valor inventario disponible"
          value={formatCOP(analytics.availableInventoryValue)}
        />
        <StatsCard
          label="Precio promedio m²"
          value={
            analytics.averagePricePerSqm === null
              ? "—"
              : formatCOPPerSqm(analytics.averagePricePerSqm)
          }
        />
        <StatsCard
          label="Precio promedio apartamento"
          value={
            analytics.averageApartmentPrice === null
              ? "—"
              : formatCOP(analytics.averageApartmentPrice)
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Estado del inventario">
          <SalesStatusChart
            available={analytics.available}
            sold={analytics.sold}
          />
        </ChartCard>
        <ChartCard title="Apartamentos por subtipo">
          <SubtypeChart data={analytics.bySubtype} />
        </ChartCard>
        <ChartCard title="Valor por estado">
          <InventoryValueChart
            availableValue={analytics.availableInventoryValue}
            soldValue={analytics.soldInventoryValue}
          />
        </ChartCard>
        <ChartCard title="Precio por m²">
          <PriceChart data={analytics.pricePerSqmByApartment} />
        </ChartCard>
      </div>
    </section>
  );
}
