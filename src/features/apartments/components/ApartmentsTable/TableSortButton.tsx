"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

type TableSortButtonProps = {
  label: string;
  sorted: false | "asc" | "desc";
  onToggle: () => void;
};

export function TableSortButton({
  label,
  sorted,
  onToggle,
}: TableSortButtonProps) {
  const Icon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-1.5 font-medium text-muted uppercase transition-colors hover:text-foreground"
      aria-label={`Ordenar por ${label}`}
    >
      <span>{label}</span>
      <Icon className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}
