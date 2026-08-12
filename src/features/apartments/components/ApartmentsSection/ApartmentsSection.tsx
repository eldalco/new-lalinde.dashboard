"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { ApartmentEditDialog } from "@/features/apartments/components/ApartmentEditDialog/ApartmentEditDialog";
import { ApartmentFiltersBar } from "@/features/apartments/components/ApartmentFiltersBar/ApartmentFiltersBar";
import { ApartmentPagination } from "@/features/apartments/components/ApartmentPagination/ApartmentPagination";
import { ApartmentSearch } from "@/features/apartments/components/ApartmentSearch/ApartmentSearch";
import { ApartmentsTable } from "@/features/apartments/components/ApartmentsTable/ApartmentsTable";
import { ApartmentsTableSkeleton } from "@/features/apartments/components/ApartmentsTable/ApartmentsTableSkeleton";
import { useApartments } from "@/features/apartments/hooks/useApartments";
import { useUpdateApartment } from "@/features/apartments/hooks/useUpdateApartment";
import type { ApartmentListItem } from "@/features/apartments/mappers/apartment-mapper";
import {
  DEFAULT_APARTMENT_FILTERS,
  filterApartments,
  hasActiveFilters,
  uniqueSortedValues,
  type ApartmentFiltersState,
} from "@/features/apartments/utils/filter-apartments";
import {
  sortApartments,
  type ApartmentSortId,
  type ApartmentSortState,
} from "@/features/apartments/utils/sort-apartments";
import { ApiError, getUserFacingErrorMessage } from "@/lib/api/api-error";
import { AUTH_PATHS } from "@/lib/auth/constants";

export function ApartmentsSection() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch, isFetching } =
    useApartments();
  const updateApartment = useUpdateApartment();

  const [filters, setFilters] = useState<ApartmentFiltersState>(
    DEFAULT_APARTMENT_FILTERS,
  );
  const [sorting, setSorting] = useState<ApartmentSortState | null>({
    id: "apto_number",
    desc: false,
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editingApartment, setEditingApartment] =
    useState<ApartmentListItem | null>(null);

  useEffect(() => {
    if (!(error instanceof ApiError) || !error.isUnauthorized) {
      return;
    }

    toast.error("Tu sesión ha expirado. Inicia sesión nuevamente.");
    router.replace(`${AUTH_PATHS.LOGIN}?expired=1`);
    router.refresh();
  }, [error, router]);

  const apartments = useMemo(() => data ?? [], [data]);

  const subtypeOptions = useMemo(
    () => uniqueSortedValues(apartments.map((item) => item.subtypeName)),
    [apartments],
  );
  const orientationOptions = useMemo(
    () => uniqueSortedValues(apartments.map((item) => item.orientation)),
    [apartments],
  );
  const floorOptions = useMemo(
    () => uniqueSortedValues(apartments.map((item) => item.floor)),
    [apartments],
  );

  const subtypeSelectOptions = useMemo(() => {
    const byId = new Map<string, string>();

    for (const apartment of apartments) {
      if (!byId.has(apartment.id_subtype)) {
        byId.set(apartment.id_subtype, apartment.subtypeName);
      }
    }

    return Array.from(byId.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [apartments]);

  const filtered = useMemo(
    () => filterApartments(apartments, filters),
    [apartments, filters],
  );

  const sorted = useMemo(
    () => sortApartments(filtered, sorting),
    [filtered, sorting],
  );

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);

  const pageRows = useMemo(() => {
    const start = safePageIndex * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [safePageIndex, pageSize, sorted]);

  const filtersActive = hasActiveFilters(filters);

  function updateFilters(next: ApartmentFiltersState) {
    setFilters(next);
    setPageIndex(0);
  }

  function handleSort(columnId: ApartmentSortId) {
    setSorting((current) => {
      if (!current || current.id !== columnId) {
        return { id: columnId, desc: false };
      }

      if (!current.desc) {
        return { id: columnId, desc: true };
      }

      return null;
    });
  }

  function clearFilters() {
    setFilters(DEFAULT_APARTMENT_FILTERS);
    setPageIndex(0);
  }

  async function handleStatusChange(
    apartment: ApartmentListItem,
    statusId: string,
  ) {
    try {
      await updateApartment.mutateAsync({
        aptoNumber: apartment.apto_number,
        payload: { id_status: statusId },
      });
      toast.success(`Estado de ${apartment.apto_number} actualizado`);
    } catch (statusError) {
      toast.error(getUserFacingErrorMessage(statusError));
    }
  }

  if (isLoading) {
    return (
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Inventario</h2>
          <p className="text-sm text-muted">Cargando inventario…</p>
        </div>
        <ApartmentsTableSkeleton />
      </section>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="No se pudo cargar el inventario"
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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Inventario</h2>
          <p className="text-sm text-muted">
            {apartments.length} apartamentos en total
            {isFetching ? " · actualizando…" : ""}
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow-sm)] sm:p-5">
        <ApartmentSearch
          value={filters.search}
          onChange={(search) => updateFilters({ ...filters, search })}
        />
        <ApartmentFiltersBar
          filters={filters}
          subtypeOptions={subtypeOptions}
          orientationOptions={orientationOptions}
          floorOptions={floorOptions}
          onChange={updateFilters}
          onClear={clearFilters}
          showClear={filtersActive}
        />
      </div>

      <ApartmentsTable
        data={pageRows}
        sorting={sorting}
        onSort={handleSort}
        hasFilters={filtersActive}
        onClearFilters={clearFilters}
        onEdit={setEditingApartment}
        onStatusChange={(apartment, statusId) => {
          void handleStatusChange(apartment, statusId);
        }}
        updatingAptoNumber={
          updateApartment.isPending
            ? (updateApartment.variables?.aptoNumber ?? null)
            : null
        }
      />

      {sorted.length > 0 ? (
        <ApartmentPagination
          pageIndex={safePageIndex}
          pageSize={pageSize}
          totalItems={sorted.length}
          onPageIndexChange={setPageIndex}
          onPageSizeChange={(nextSize) => {
            setPageSize(nextSize);
            setPageIndex(0);
          }}
        />
      ) : null}

      <ApartmentEditDialog
        apartment={editingApartment}
        open={Boolean(editingApartment)}
        onClose={() => setEditingApartment(null)}
        subtypeOptions={subtypeSelectOptions}
      />
    </section>
  );
}
