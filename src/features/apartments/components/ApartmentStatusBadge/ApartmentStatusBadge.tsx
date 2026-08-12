import { Badge } from "@/components/ui/Badge";
import type { ApartmentStatusLabel } from "@/features/apartments/mappers/apartment-mapper";

type ApartmentStatusBadgeProps = {
  statusLabel: ApartmentStatusLabel;
};

function toneForStatus(statusLabel: ApartmentStatusLabel) {
  if (statusLabel === "Disponible") {
    return "success" as const;
  }

  if (statusLabel === "Vendido") {
    return "danger" as const;
  }

  return "neutral" as const;
}

export function ApartmentStatusBadge({ statusLabel }: ApartmentStatusBadgeProps) {
  return <Badge tone={toneForStatus(statusLabel)}>{statusLabel}</Badge>;
}
