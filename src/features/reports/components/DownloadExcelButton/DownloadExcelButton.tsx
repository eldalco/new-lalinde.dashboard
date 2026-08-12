"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { useDownloadApartments } from "@/features/reports/hooks/useDownloadApartments";
import { getUserFacingErrorMessage } from "@/lib/api/api-error";

export function DownloadExcelButton() {
  const download = useDownloadApartments();

  async function handleClick() {
    try {
      await download.mutateAsync();
      toast.success("Descarga de lalinde-apartments.xlsx iniciada");
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error));
    }
  }

  return (
    <Button
      variant="secondary"
      loading={download.isPending}
      onClick={() => void handleClick()}
      aria-label="Descargar Excel de apartamentos"
    >
      <Download className="h-4 w-4" aria-hidden />
      Descargar Excel
    </Button>
  );
}
