import type { ApartmentListItem } from "@/features/apartments/mappers/apartment-mapper";
import { includesIgnoreCase } from "@/lib/utils/strings";

export type ApartmentFiltersState = {
  search: string;
  status: "all" | "available" | "sold";
  subtype: string;
  orientation: string;
  floor: string;
};

export const DEFAULT_APARTMENT_FILTERS: ApartmentFiltersState = {
  search: "",
  status: "all",
  subtype: "all",
  orientation: "all",
  floor: "all",
};

export function hasActiveFilters(filters: ApartmentFiltersState): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.subtype !== "all" ||
    filters.orientation !== "all" ||
    filters.floor !== "all"
  );
}

export function filterApartments(
  apartments: ApartmentListItem[],
  filters: ApartmentFiltersState,
): ApartmentListItem[] {
  const query = filters.search.trim();

  return apartments.filter((apartment) => {
    if (filters.status === "available" && apartment.statusLabel !== "Disponible") {
      return false;
    }

    if (filters.status === "sold" && apartment.statusLabel !== "Vendido") {
      return false;
    }

    if (
      filters.subtype !== "all" &&
      apartment.subtypeName.toLocaleLowerCase("es") !==
        filters.subtype.toLocaleLowerCase("es")
    ) {
      return false;
    }

    if (
      filters.orientation !== "all" &&
      apartment.orientation !== filters.orientation
    ) {
      return false;
    }

    if (filters.floor !== "all" && apartment.floor !== filters.floor) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      includesIgnoreCase(apartment.apto_number, query) ||
      includesIgnoreCase(apartment.subtypeName, query) ||
      includesIgnoreCase(apartment.orientation, query) ||
      includesIgnoreCase(apartment.floor, query)
    );
  });
}

export function uniqueSortedValues(
  values: Array<string | null | undefined>,
): string[] {
  const set = new Set<string>();

  for (const value of values) {
    if (value && value.trim()) {
      set.add(value.trim());
    }
  }

  return Array.from(set).sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base", numeric: true }),
  );
}
