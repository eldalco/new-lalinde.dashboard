import type { ReactNode } from "react";

type ApartmentsTableCellProps = {
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
};

export function ApartmentsTableCell({
  children,
  className = "",
  align = "left",
}: ApartmentsTableCellProps) {
  return (
    <td
      className={`px-2 py-2 whitespace-nowrap text-xs text-foreground ${
        align === "right" ? "text-right" : "text-left"
      } ${className}`}
    >
      {children}
    </td>
  );
}
