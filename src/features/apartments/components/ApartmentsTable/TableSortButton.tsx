"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";

type TableSortButtonProps = {
  label: ReactNode;
  sortLabel: string;
  sorted: false | "asc" | "desc";
  onToggle: () => void;
};

export function TableSortButton({
  label,
  sortLabel,
  sorted,
  onToggle,
}: TableSortButtonProps) {
  const Icon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-start gap-1 text-left text-[11px] font-medium text-muted uppercase transition-colors hover:text-foreground"
      aria-label={`Ordenar por ${sortLabel}`}
    >
      <span className="min-w-0">{label}</span>
      <Icon className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
    </button>
  );
}
