import type { ApartmentListItem } from "@/features/apartments/mappers/apartment-mapper";
import { toNumber } from "@/lib/utils/numbers";
import { compareStrings } from "@/lib/utils/strings";

export type ApartmentSortId =
  | "apto_number"
  | "total_price"
  | "square_meter_price"
  | "total_area"
  | "floor"
  | "status"
  | "subtype";

export type ApartmentSortState = {
  id: ApartmentSortId;
  desc: boolean;
};

function compareNumericStrings(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
): number {
  const left = toNumber(a);
  const right = toNumber(b);

  if (left === null && right === null) {
    return 0;
  }

  if (left === null) {
    return 1;
  }

  if (right === null) {
    return -1;
  }

  return left - right;
}

function compareBySortId(
  a: ApartmentListItem,
  b: ApartmentListItem,
  id: ApartmentSortId,
): number {
  switch (id) {
    case "apto_number":
      return compareStrings(a.apto_number, b.apto_number);
    case "total_price":
      return compareNumericStrings(a.total_price, b.total_price);
    case "square_meter_price":
      return compareNumericStrings(a.square_meter_price, b.square_meter_price);
    case "total_area":
      return compareNumericStrings(a.total_area, b.total_area);
    case "floor":
      return compareStrings(a.floor, b.floor);
    case "status":
      return compareStrings(a.statusLabel, b.statusLabel);
    case "subtype":
      return compareStrings(a.subtypeName, b.subtypeName);
    default:
      return 0;
  }
}

export function sortApartments(
  apartments: ApartmentListItem[],
  sorting: ApartmentSortState | null,
): ApartmentListItem[] {
  if (!sorting) {
    return apartments;
  }

  const sorted = [...apartments].sort((a, b) =>
    compareBySortId(a, b, sorting.id),
  );

  return sorting.desc ? sorted.reverse() : sorted;
}
