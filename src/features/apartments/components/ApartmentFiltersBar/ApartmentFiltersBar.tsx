"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ApartmentFilters } from "@/features/apartments/components/ApartmentFilters/ApartmentFilters";
import type { ApartmentFiltersState } from "@/features/apartments/utils/filter-apartments";

type ApartmentFiltersBarProps = {
  filters: ApartmentFiltersState;
  subtypeOptions: string[];
  orientationOptions: string[];
  floorOptions: string[];
  onChange: (next: ApartmentFiltersState) => void;
  onClear: () => void;
  showClear: boolean;
};

export function ApartmentFiltersBar({
  filters,
  subtypeOptions,
  orientationOptions,
  floorOptions,
  onChange,
  onClear,
  showClear,
}: ApartmentFiltersBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hidden md:block">
        <ApartmentFilters
          filters={filters}
          subtypeOptions={subtypeOptions}
          orientationOptions={orientationOptions}
          floorOptions={floorOptions}
          onChange={onChange}
          onClear={onClear}
          showClear={showClear}
        />
      </div>

      <div className="flex items-center gap-3 md:hidden">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setOpen(true)}
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filtros
          {showClear ? (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              activos
            </span>
          ) : null}
        </Button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Filtros"
        description="Ajusta el inventario visible."
        footer={
          <div className="flex justify-end gap-3">
            {showClear ? (
              <Button
                variant="ghost"
                onClick={() => {
                  onClear();
                }}
              >
                Limpiar filtros
              </Button>
            ) : null}
            <Button onClick={() => setOpen(false)}>Aplicar</Button>
          </div>
        }
      >
        <ApartmentFilters
          filters={filters}
          subtypeOptions={subtypeOptions}
          orientationOptions={orientationOptions}
          floorOptions={floorOptions}
          onChange={onChange}
          onClear={onClear}
          showClear={false}
        />
      </Modal>
    </>
  );
}
