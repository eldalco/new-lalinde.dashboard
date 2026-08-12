/** Case-insensitive includes check for client-side search. */
export function includesIgnoreCase(
  haystack: string | null | undefined,
  needle: string,
): boolean {
  if (!haystack) {
    return false;
  }

  return haystack.toLocaleLowerCase("es").includes(needle.toLocaleLowerCase("es"));
}

/** Collator for Spanish locale string sorting. */
export function compareStrings(
  a: string | null | undefined,
  b: string | null | undefined,
): number {
  return (a ?? "").localeCompare(b ?? "", "es", {
    sensitivity: "base",
    numeric: true,
  });
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
