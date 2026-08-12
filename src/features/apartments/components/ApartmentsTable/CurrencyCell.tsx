import { formatCOP } from "@/lib/utils/currency";

type CurrencyCellProps = {
  value: string;
};

export function CurrencyCell({ value }: CurrencyCellProps) {
  return <span className="tabular-nums">{formatCOP(value)}</span>;
}
