import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/PageContainer";
import { AnalyticsSection } from "@/features/analytics/components/AnalyticsSection/AnalyticsSection";
import { ApartmentsSection } from "@/features/apartments/components/ApartmentsSection";
import { ReportsSection } from "@/features/reports/components/ReportsSection/ReportsSection";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted">
          Resumen general del inventario inmobiliario de Lalinde.
        </p>
      </div>

      <div className="mt-8 space-y-10">
        <ApartmentsSection />
        <ReportsSection />
        <AnalyticsSection />
      </div>
    </PageContainer>
  );
}
