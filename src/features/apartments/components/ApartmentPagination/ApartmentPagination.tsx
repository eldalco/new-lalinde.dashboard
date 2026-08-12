"use client";

import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

type ApartmentPaginationProps = {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function ApartmentPagination({
  pageIndex,
  pageSize,
  totalItems,
  onPageIndexChange,
  onPageSizeChange,
}: ApartmentPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(pageIndex + 1, pageCount);
  const from = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(totalItems, (pageIndex + 1) * pageSize);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">
        Mostrando {from}–{to} de {totalItems} apartamentos
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-36">
          <Select
            label="Filas"
            name="pageSize"
            value={String(pageSize)}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            options={[
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "50", label: "50" },
            ]}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={pageIndex <= 0}
            onClick={() => onPageIndexChange(pageIndex - 1)}
            aria-label="Página anterior"
          >
            Anterior
          </Button>
          <span className="text-sm text-muted">
            {currentPage} / {pageCount}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={pageIndex >= pageCount - 1}
            onClick={() => onPageIndexChange(pageIndex + 1)}
            aria-label="Página siguiente"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
