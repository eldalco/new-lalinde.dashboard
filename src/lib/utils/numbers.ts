/**
 * Converts API numeric strings (and numbers) to a finite number.
 * Returns null when the value cannot be parsed.
 */
export function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = value.trim().replace(/,/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

/** Formats a decimal for display; returns em dash when invalid. */
export function formatDecimal(
  value: string | number | null | undefined,
  fractionDigits = 2,
): string {
  const amount = toNumber(value);

  if (amount === null) {
    return "—";
  }

  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

/** Formats a percentage with one decimal place by default. */
export function formatPercent(
  value: number | null | undefined,
  fractionDigits = 1,
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(fractionDigits)}%`;
}
