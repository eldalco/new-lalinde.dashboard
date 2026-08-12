import { Spinner } from "@/components/ui/Spinner";
import { PageContainer } from "@/components/layout/PageContainer";

export default function DashboardLoading() {
  return (
    <PageContainer>
      <div className="flex min-h-48 flex-col items-center justify-center gap-3">
        <Spinner size="lg" label="Cargando dashboard" />
        <p className="text-sm text-muted">Cargando dashboard…</p>
      </div>
    </PageContainer>
  );
}
