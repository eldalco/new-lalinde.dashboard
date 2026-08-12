"use client";

import type { Cell, Row } from "@tanstack/react-table";

import { ApartmentsTableCell } from "@/features/apartments/components/ApartmentsTable/ApartmentsTableCell";
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
    <tr className="border-b border-border transition-colors hover:bg-surface-muted/70 last:border-b-0">
      {row.getAllCells().map((cell, index) => (
        <ApartmentsTableCell
          key={cell.id}
          className={
            index === 0
              ? "sticky left-0 z-[1] bg-surface shadow-[1px_0_0_var(--border)]"
              : undefined
          }
        >
          <FlexRender cell={cell} />
        </ApartmentsTableCell>
      ))}
    </tr>
  );
}
