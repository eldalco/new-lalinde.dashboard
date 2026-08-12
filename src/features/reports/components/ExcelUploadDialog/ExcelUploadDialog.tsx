"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { useUploadApartments } from "@/features/reports/hooks/useUploadApartments";
import { getUserFacingErrorMessage } from "@/lib/api/api-error";

const ACCEPTED = ".xlsx,.xls";

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function hasValidExtension(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith(".xlsx") || lower.endsWith(".xls");
}

type ExcelUploadDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ExcelUploadDialog({ open, onClose }: ExcelUploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const upload = useUploadApartments();

  function reset() {
    setFile(null);
    setLocalError(null);
    setDragActive(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleClose() {
    if (upload.isPending) {
      return;
    }
    reset();
    onClose();
  }

  function selectFile(next: File | null) {
    setLocalError(null);

    if (!next) {
      setFile(null);
      return;
    }

    if (!hasValidExtension(next.name)) {
      setFile(null);
      setLocalError("Solo se aceptan archivos .xlsx o .xls.");
      return;
    }

    setFile(next);
  }

  async function handleUpload() {
    if (!file) {
      setLocalError("Selecciona un archivo Excel para continuar.");
      return;
    }

    try {
      const result = await upload.mutateAsync(file);
      toast.success(
        `${result.updated} apartamentos actualizados correctamente`,
      );
      reset();
      onClose();
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error));
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Actualizar desde Excel"
      description="Usa la misma estructura del Excel oficial: hoja Apartments y exactamente estas columnas en orden."
      footer={
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={upload.isPending}
          >
            Cancelar
          </Button>
          <Button
            loading={upload.isPending}
            disabled={!file}
            onClick={() => void handleUpload()}
          >
            Subir
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragActive(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            const dropped = event.dataTransfer.files?.[0] ?? null;
            selectFile(dropped);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius)] border border-dashed px-6 py-10 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border bg-surface-muted"
          }`}
        >
          <Upload className="h-8 w-8 text-primary" aria-hidden />
          <p className="mt-3 text-sm font-medium text-foreground">
            Arrastra el archivo aquí o haz clic para seleccionar
          </p>
          <p className="mt-1 text-xs text-muted">Formatos: .xlsx, .xls</p>
          <p className="mt-3 max-w-md text-left text-[11px] leading-4 text-muted">
            Columnas: Numero de apartamento, Precio total, Area privada, Area
            Publica, Area Acue, Area escalera, Area total, Precio de metro
            cuadrado, Baños, Cuartos, Garajes, Orientación, Piso(s), Estado,
            Subtipo.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="sr-only"
            aria-label="Seleccionar archivo Excel"
            onChange={(event) => {
              selectFile(event.target.files?.[0] ?? null);
            }}
          />
        </div>

        {file ? (
          <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="text-muted">{formatBytes(file.size)}</p>
          </div>
        ) : null}

        {localError ? (
          <p className="text-sm text-danger" role="alert">
            {localError}
          </p>
        ) : null}

        {upload.isPending ? (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted px-4 py-3 text-sm text-muted">
            <Spinner size="sm" label="Subiendo archivo" />
            Subiendo archivo y sincronizando inventario…
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
