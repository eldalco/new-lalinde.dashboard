export const STICKY_LEFT_COLUMN_IDS = new Set(["apto_number"]);

export const STICKY_RIGHT_COLUMN_IDS = new Set(["status", "actions"]);

/** Approximate width of the Acciones column for stacking Estado to its left. */
export const ACTIONS_STICKY_WIDTH_CLASS = "right-[5.75rem]";

export function getStickyHeaderClass(columnId: string): string {
  if (columnId === "apto_number") {
    return "sticky left-0 z-[3] bg-surface-muted shadow-[1px_0_0_var(--border)]";
  }

  if (columnId === "actions") {
    return "sticky right-0 z-[3] min-w-[5.75rem] bg-surface-muted shadow-[-1px_0_0_var(--border)]";
  }

  if (columnId === "status") {
    return `sticky ${ACTIONS_STICKY_WIDTH_CLASS} z-[3] bg-surface-muted shadow-[-1px_0_0_var(--border)]`;
  }

  return "";
}

export function getStickyCellClass(columnId: string): string {
  if (columnId === "apto_number") {
    return "sticky left-0 z-[1] bg-surface shadow-[1px_0_0_var(--border)] group-hover:bg-surface-muted/70";
  }

  if (columnId === "actions") {
    return "sticky right-0 z-[1] min-w-[5.75rem] bg-surface shadow-[-1px_0_0_var(--border)] group-hover:bg-surface-muted/70";
  }

  if (columnId === "status") {
    return `sticky ${ACTIONS_STICKY_WIDTH_CLASS} z-[1] bg-surface shadow-[-1px_0_0_var(--border)] group-hover:bg-surface-muted/70`;
  }

  return "";
}
