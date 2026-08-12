import { toNumber } from "@/lib/utils/numbers";

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** Formats a numeric string or number as Colombian pesos (COP). */
export function formatCOP(value: string | number | null | undefined): string {
  const amount = toNumber(value);

  if (amount === null) {
    return "—";
  }

  return copFormatter.format(amount);
}

/** Formats square-meter price as COP with a / m² suffix. */
export function formatCOPPerSqm(
  value: string | number | null | undefined,
): string {
  const formatted = formatCOP(value);

  if (formatted === "—") {
    return formatted;
  }

  return `${formatted} / m²`;
}
