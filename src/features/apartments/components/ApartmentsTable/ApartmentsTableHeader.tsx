"use client";

import type { Header, HeaderGroup } from "@tanstack/react-table";

import { TableSortButton } from "@/features/apartments/components/ApartmentsTable/TableSortButton";
import { SORTABLE_COLUMN_IDS } from "@/features/apartments/components/ApartmentsTable/columns";
import { getStickyHeaderClass } from "@/features/apartments/components/ApartmentsTable/table-sticky";
import { apartmentTableFeatures } from "@/features/apartments/components/ApartmentsTable/table-features";
import type { ApartmentListItem } from "@/features/apartments/mappers/apartment-mapper";
import type {
  ApartmentSortId,
  ApartmentSortState,
} from "@/features/apartments/utils/sort-apartments";

const SORT_ARIA_LABELS: Record<string, string> = {
  apto_number: "Apartamento",
  total_price: "Precio total",
  square_meter_price: "Precio m²",
  total_area: "Área total",
  floor: "Piso",
  status: "Estado",
  subtype: "Subtipo",
};

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
            const headerDef = header.column.columnDef.header;
            const plainLabel =
              typeof headerDef === "string" ? headerDef : columnId;

            return (
              <th
                key={header.id}
                className={`px-2 py-2 text-left text-[11px] tracking-wide text-muted ${
                  columnId === "status" || columnId === "actions"
                    ? ""
                    : "max-w-[6.5rem]"
                } ${
                  columnId === "actions" ? "min-w-[5.75rem] w-[5.75rem]" : ""
                } ${
                  columnId === "status" ? "min-w-[8.5rem]" : ""
                } ${getStickyHeaderClass(columnId)}`}
              >
                {header.isPlaceholder ? null : isSortable ? (
                  <TableSortButton
                    label={
                      typeof headerDef === "string" ? (
                        plainLabel
                      ) : (
                        <FlexRender header={header} />
                      )
                    }
                    sortLabel={SORT_ARIA_LABELS[columnId] ?? plainLabel}
                    sorted={sorted}
                    onToggle={() => onSort(columnId as ApartmentSortId)}
                  />
                ) : typeof headerDef === "string" ? (
                  <span className="uppercase">{headerDef}</span>
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
