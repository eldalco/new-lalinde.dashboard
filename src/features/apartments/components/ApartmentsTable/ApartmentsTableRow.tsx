"use client";

import type { Cell, Row } from "@tanstack/react-table";

import { ApartmentsTableCell } from "@/features/apartments/components/ApartmentsTable/ApartmentsTableCell";
import { getStickyCellClass } from "@/features/apartments/components/ApartmentsTable/table-sticky";
import { apartmentTableFeatures } from "@/features/apartments/components/ApartmentsTable/table-features";
import type { ApartmentListItem } from "@/features/apartments/mappers/apartment-mapper";

type ApartmentsTableRowProps = {
  row: Row<typeof apartmentTableFeatures, ApartmentListItem>;
  FlexRender: React.ComponentType<{
    cell: Cell<typeof apartmentTableFeatures, ApartmentListItem, unknown>;
  }>;
};

export function ApartmentsTableRow({
  row,
  FlexRender,
}: ApartmentsTableRowProps) {
  return (
    <tr className="group border-b border-border transition-colors hover:bg-surface-muted/70 last:border-b-0">
      {row.getAllCells().map((cell) => (
        <ApartmentsTableCell
          key={cell.id}
          className={getStickyCellClass(cell.column.id)}
        >
          <FlexRender cell={cell} />
        </ApartmentsTableCell>
      ))}
    </tr>
  );
}
