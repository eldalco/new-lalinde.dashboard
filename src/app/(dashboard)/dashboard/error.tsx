"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard error:", error.message);
  }, [error]);

  return (
    <PageContainer>
      <div className="rounded-[var(--radius)] border border-danger-border bg-danger-bg p-6">
        <h2 className="text-lg font-semibold text-danger">
          No se pudo cargar el dashboard
        </h2>
        <p className="mt-2 text-sm text-muted">
          Ocurrió un problema al mostrar esta sección. Puedes intentar de nuevo.
        </p>
        <Button className="mt-4" variant="secondary" onClick={reset}>
          Reintentar
        </Button>
      </div>
    </PageContainer>
  );
}
