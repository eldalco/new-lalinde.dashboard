"use client";

import { useMemo } from "react";
import { useTable } from "@tanstack/react-table";

import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ApartmentsTableHeader } from "@/features/apartments/components/ApartmentsTable/ApartmentsTableHeader";
import { ApartmentsTableRow } from "@/features/apartments/components/ApartmentsTable/ApartmentsTableRow";
import {
  createApartmentColumns,
  type ApartmentColumnsOptions,
} from "@/features/apartments/components/ApartmentsTable/columns";
import { apartmentTableFeatures } from "@/features/apartments/components/ApartmentsTable/table-features";
import { useDragScroll } from "@/features/apartments/hooks/useDragScroll";
import type { ApartmentListItem } from "@/features/apartments/mappers/apartment-mapper";
import type {
  ApartmentSortId,
  ApartmentSortState,
} from "@/features/apartments/utils/sort-apartments";

const EMPTY_DATA: ApartmentListItem[] = [];

type ApartmentsTableProps = {
  data: ApartmentListItem[];
  sorting: ApartmentSortState | null;
  onSort: (columnId: ApartmentSortId) => void;
  hasFilters: boolean;
  onClearFilters: () => void;
} & ApartmentColumnsOptions;

export function ApartmentsTable({
  data,
  sorting,
  onSort,
  hasFilters,
  onClearFilters,
  onEdit,
  onStatusChange,
  updatingAptoNumber,
}: ApartmentsTableProps) {
  const tableData = data.length > 0 ? data : EMPTY_DATA;
  const { ref: scrollRef, dragProps } = useDragScroll<HTMLDivElement>();

  const columns = useMemo(
    () =>
      createApartmentColumns({
        onEdit,
        onStatusChange,
        updatingAptoNumber,
      }),
    [onEdit, onStatusChange, updatingAptoNumber],
  );

  const table = useTable({
    features: apartmentTableFeatures,
    data: tableData,
    columns,
    getRowId: (row) => row.apto_number,
  });

  if (data.length === 0) {
    return (
      <EmptyState
        title={
          hasFilters
            ? "No encontramos apartamentos con los filtros seleccionados."
            : "No hay apartamentos para mostrar."
        }
        description={
          hasFilters
            ? "Prueba ajustando la búsqueda o los filtros."
            : undefined
        }
        action={
          hasFilters ? (
            <Button variant="secondary" onClick={onClearFilters}>
              Limpiar filtros
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-[var(--shadow-sm)]">
      <div
        ref={scrollRef}
        {...dragProps}
        className={`overflow-x-auto ${dragProps.className}`}
      >
        <table className="min-w-max w-full border-collapse text-left">
          <ApartmentsTableHeader
            headerGroups={table.getHeaderGroups()}
            sorting={sorting}
            onSort={onSort}
            FlexRender={table.FlexRender}
          />
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <ApartmentsTableRow
                key={row.id}
                row={row}
                FlexRender={table.FlexRender}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
