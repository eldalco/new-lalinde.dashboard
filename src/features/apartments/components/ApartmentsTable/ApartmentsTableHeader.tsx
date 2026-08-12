"use client";

import type { Header, HeaderGroup } from "@tanstack/react-table";

import { TableSortButton } from "@/features/apartments/components/ApartmentsTable/TableSortButton";
import {
  SORTABLE_COLUMN_IDS,
} from "@/features/apartments/components/ApartmentsTable/columns";
import { apartmentTableFeatures } from "@/features/apartments/components/ApartmentsTable/table-features";
import type { ApartmentListItem } from "@/features/apartments/mappers/apartment-mapper";
import type {
  ApartmentSortId,
  ApartmentSortState,
} from "@/features/apartments/utils/sort-apartments";

type ApartmentsTableHeaderProps = {
  headerGroups: HeaderGroup<typeof apartmentTableFeatures, ApartmentListItem>[];
  sorting: ApartmentSortState | null;
  onSort: (columnId: ApartmentSortId) => void;
  FlexRender: React.ComponentType<{
    header: Header<typeof apartmentTableFeatures, ApartmentListItem, unknown>;
  }>;
};

export function ApartmentsTableHeader({
  headerGroups,
  sorting,
  onSort,
  FlexRender,
}: ApartmentsTableHeaderProps) {
  return (
    <thead className="sticky top-0 z-10 border-b border-border bg-surface-muted">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const columnId = header.column.id;
            const isSortable = SORTABLE_COLUMN_IDS.has(columnId);
            const sorted =
              sorting?.id === columnId
                ? sorting.desc
                  ? "desc"
                  : "asc"
                : false;

            return (
              <th
                key={header.id}
                className={`px-3 py-3 text-left text-xs tracking-wide whitespace-nowrap text-muted ${
                  header.column.id === "apto_number"
                    ? "sticky left-0 z-[2] bg-surface-muted shadow-[1px_0_0_var(--border)]"
                    : ""
                }`}
              >
                {header.isPlaceholder ? null : isSortable ? (
                  <TableSortButton
                    label={String(header.column.columnDef.header ?? columnId)}
                    sorted={sorted}
                    onToggle={() => onSort(columnId as ApartmentSortId)}
                  />
                ) : (
                  <FlexRender header={header} />
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
