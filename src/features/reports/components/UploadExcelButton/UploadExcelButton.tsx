"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ExcelUploadDialog } from "@/features/reports/components/ExcelUploadDialog/ExcelUploadDialog";

export function UploadExcelButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setOpen(true)}
        aria-label="Actualizar inventario desde Excel"
      >
        <Upload className="h-4 w-4" aria-hidden />
        Actualizar desde Excel
      </Button>
      <ExcelUploadDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
