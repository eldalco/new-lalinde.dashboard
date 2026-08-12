import { DownloadExcelButton } from "@/features/reports/components/DownloadExcelButton/DownloadExcelButton";
import { UploadExcelButton } from "@/features/reports/components/UploadExcelButton/UploadExcelButton";

export function ReportsSection() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Reportes</h2>
        <p className="text-sm text-muted">
          Descarga o carga el Excel oficial (lalinde-apartments.xlsx) con las
          15 columnas en el orden correcto.
        </p>
      </div>
      <div className="flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:p-5">
        <DownloadExcelButton />
        <UploadExcelButton />
      </div>
    </section>
  );
}
