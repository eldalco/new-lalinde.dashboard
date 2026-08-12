import { formatDecimal } from "@/lib/utils/numbers";

type AreaCellProps = {
  value: string | undefined;
};

export function AreaCell({ value }: AreaCellProps) {
  if (value === undefined || value === "") {
    return <span className="text-muted">—</span>;
  }

  return <span className="tabular-nums">{formatDecimal(value)}</span>;
}
