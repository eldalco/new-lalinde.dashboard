"use client";

import { Select } from "@/components/ui/Select";
import type { ApartmentFiltersState } from "@/features/apartments/utils/filter-apartments";

type ApartmentFiltersProps = {
  filters: ApartmentFiltersState;
  subtypeOptions: string[];
  orientationOptions: string[];
  floorOptions: string[];
  onChange: (next: ApartmentFiltersState) => void;
  onClear: () => void;
  showClear: boolean;
};

export function ApartmentFilters({
  filters,
  subtypeOptions,
  orientationOptions,
  floorOptions,
  onChange,
  onClear,
  showClear,
}: ApartmentFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Select
        label="Estado"
        name="status"
        value={filters.status}
        onChange={(event) =>
          onChange({
            ...filters,
            status: event.target.value as ApartmentFiltersState["status"],
          })
        }
        options={[
          { value: "all", label: "Todos" },
          { value: "available", label: "Disponible" },
          { value: "sold", label: "Vendido" },
        ]}
      />
      <Select
        label="Subtipo"
        name="subtype"
        value={filters.subtype}
        onChange={(event) =>
          onChange({ ...filters, subtype: event.target.value })
        }
        options={[
          { value: "all", label: "Todos" },
          ...subtypeOptions.map((subtype) => ({
            value: subtype,
            label: subtype,
          })),
        ]}
      />
      <Select
        label="Orientación"
        name="orientation"
        value={filters.orientation}
        onChange={(event) =>
          onChange({ ...filters, orientation: event.target.value })
        }
        options={[
          { value: "all", label: "Todas" },
          ...orientationOptions.map((orientation) => ({
            value: orientation,
            label: orientation,
          })),
        ]}
      />
      <div className="flex flex-col gap-1.5">
        <Select
          label="Piso"
          name="floor"
          value={filters.floor}
          onChange={(event) =>
            onChange({ ...filters, floor: event.target.value })
          }
          options={[
            { value: "all", label: "Todos" },
            ...floorOptions.map((floor) => ({
              value: floor,
              label: floor,
            })),
          ]}
        />
        {showClear ? (
          <button
            type="button"
            onClick={onClear}
            className="self-start text-xs font-medium text-primary hover:underline"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>
    </div>
  );
}
