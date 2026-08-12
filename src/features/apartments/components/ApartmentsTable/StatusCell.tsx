import { ApartmentStatusBadge } from "@/features/apartments/components/ApartmentStatusBadge/ApartmentStatusBadge";
import type { ApartmentStatusLabel } from "@/features/apartments/mappers/apartment-mapper";

type StatusCellProps = {
  statusLabel: ApartmentStatusLabel;
};

export function StatusCell({ statusLabel }: StatusCellProps) {
  return <ApartmentStatusBadge statusLabel={statusLabel} />;
}
