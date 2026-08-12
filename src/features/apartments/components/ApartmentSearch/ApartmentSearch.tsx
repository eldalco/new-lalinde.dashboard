"use client";

import { Search } from "lucide-react";

type ApartmentSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ApartmentSearch({ value, onChange }: ApartmentSearchProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor="apartment-search" className="sr-only">
        Buscar apartamentos
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        id="apartment-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por apartamento, subtipo, orientación o piso"
        className="h-11 w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-10 text-sm text-foreground shadow-[var(--shadow-sm)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}
