import {
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/Button";
import { AreaCell } from "@/features/apartments/components/ApartmentsTable/AreaCell";
import { ColumnHeaderLabel } from "@/features/apartments/components/ApartmentsTable/ColumnHeaderLabel";
import { CurrencyCell } from "@/features/apartments/components/ApartmentsTable/CurrencyCell";
import { StatusCell } from "@/features/apartments/components/ApartmentsTable/StatusCell";
import { ApartmentStatusSelect } from "@/features/apartments/components/ApartmentStatusSelect/ApartmentStatusSelect";
import { apartmentTableFeatures } from "@/features/apartments/components/ApartmentsTable/table-features";
import type { ApartmentListItem } from "@/features/apartments/mappers/apartment-mapper";
import { formatDecimal } from "@/lib/utils/numbers";

const columnHelper = createColumnHelper<
  typeof apartmentTableFeatures,
  ApartmentListItem
>();

export type ApartmentColumnsOptions = {
  onEdit: (apartment: ApartmentListItem) => void;
  onStatusChange: (apartment: ApartmentListItem, statusId: string) => void;
  updatingAptoNumber: string | null;
};

export function createApartmentColumns({
  onEdit,
  onStatusChange,
  updatingAptoNumber,
}: ApartmentColumnsOptions) {
  return columnHelper.columns([
    columnHelper.accessor("apto_number", {
      id: "apto_number",
      header: "Apartamento",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("total_price", {
      id: "total_price",
      header: () => <ColumnHeaderLabel lines={["Precio", "total"]} />,
      cell: ({ getValue }) => <CurrencyCell value={getValue()} />,
    }),
    columnHelper.accessor("built_area", {
      id: "built_area",
      header: () => (
        <ColumnHeaderLabel lines={["Área", "construida (m²)"]} />
      ),
      cell: ({ getValue }) => <AreaCell value={getValue()} />,
    }),
    columnHelper.accessor("terrace_area", {
      id: "terrace_area",
      header: () => (
        <ColumnHeaderLabel lines={["Área pública/", "terraza (m²)"]} />
      ),
      cell: ({ getValue }) => <AreaCell value={getValue()} />,
    }),
    columnHelper.accessor("acue_area", {
      id: "acue_area",
      header: () => <ColumnHeaderLabel lines={["Área ACUE", "(m²)"]} />,
      cell: ({ getValue }) => <AreaCell value={getValue()} />,
    }),
    columnHelper.accessor("stair_area", {
      id: "stair_area",
      header: () => (
        <ColumnHeaderLabel lines={["Área", "escalera (m²)"]} />
      ),
      cell: ({ getValue }) => <AreaCell value={getValue()} />,
    }),
    columnHelper.accessor("total_area", {
      id: "total_area",
      header: () => <ColumnHeaderLabel lines={["Área total", "(m²)"]} />,
      cell: ({ getValue }) => <AreaCell value={getValue()} />,
    }),
    columnHelper.accessor("square_meter_price", {
      id: "square_meter_price",
      header: () => <ColumnHeaderLabel lines={["Precio", "m²"]} />,
      cell: ({ getValue }) => <CurrencyCell value={getValue()} />,
    }),
    columnHelper.accessor("deck_area", {
      id: "deck_area",
      header: () => <ColumnHeaderLabel lines={["Área deck", "(m²)"]} />,
      cell: ({ getValue }) => <AreaCell value={getValue()} />,
    }),
    columnHelper.accessor("private_area", {
      id: "private_area",
      header: () => <ColumnHeaderLabel lines={["Área privada", "(m²)"]} />,
      cell: ({ getValue }) => <AreaCell value={getValue()} />,
    }),
    columnHelper.accessor("global_total_area", {
      id: "global_total_area",
      header: () => (
        <ColumnHeaderLabel lines={["Área global", "total (m²)"]} />
      ),
      cell: ({ getValue }) => <AreaCell value={getValue()} />,
    }),
    columnHelper.accessor("bathrooms", {
      id: "bathrooms",
      header: "Baños",
      cell: ({ getValue }) => (
        <span className="tabular-nums">{formatDecimal(getValue(), 1)}</span>
      ),
    }),
    columnHelper.accessor("rooms", {
      id: "rooms",
      header: "Habitaciones",
      cell: ({ getValue }) => (
        <span className="tabular-nums">{formatDecimal(getValue(), 1)}</span>
      ),
    }),
    columnHelper.accessor("garage_spaces", {
      id: "garage_spaces",
      header: "Garajes",
      cell: ({ getValue }) => (
        <span className="tabular-nums">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("orientation", {
      id: "orientation",
      header: "Orientación",
    }),
    columnHelper.accessor("floor", {
      id: "floor",
      header: "Piso",
    }),
    columnHelper.accessor("subtypeName", {
      id: "subtype",
      header: "Subtipo",
      cell: ({ getValue }) => (
        <span className="capitalize">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("statusLabel", {
      id: "status",
      header: "Estado",
      cell: ({ row }) => (
        <div className="min-w-[7.5rem] space-y-1.5">
          <StatusCell statusLabel={row.original.statusLabel} />
          <div className="hidden lg:block">
            <ApartmentStatusSelect
              label="Cambiar estado"
              value={row.original.id_status}
              disabled={updatingAptoNumber === row.original.apto_number}
              onChange={(statusId) => {
                if (statusId !== row.original.id_status) {
                  onStatusChange(row.original, statusId);
                }
              }}
            />
          </div>
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(row.original)}
          aria-label={`Editar apartamento ${row.original.apto_number}`}
        >
          Editar
        </Button>
      ),
    }),
  ]) satisfies ColumnDef<typeof apartmentTableFeatures, ApartmentListItem>[];
}

export const SORTABLE_COLUMN_IDS = new Set([
  "apto_number",
  "total_price",
  "square_meter_price",
  "total_area",
  "floor",
  "status",
  "subtype",
]);
