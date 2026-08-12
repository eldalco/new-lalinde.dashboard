import { z } from "zod";

import { APARTMENT_STATUS } from "@/features/apartments/constants/status";
import type { ApartmentPatchPayload } from "@/features/apartments/types/apartment";
import { toNumber } from "@/lib/utils/numbers";

const numberField = z
  .number({ error: "Debe ser un número válido" })
  .finite("Debe ser un número válido")
  .nonnegative("No puede ser negativo");

export const updateApartmentFormSchema = z.object({
  total_price: numberField,
  built_area: numberField,
  terrace_area: numberField,
  acue_area: numberField,
  stair_area: numberField,
  total_area: numberField,
  square_meter_price: numberField,
  bathrooms: numberField,
  rooms: numberField,
  garage_spaces: z
    .number({ error: "Debe ser un número válido" })
    .int("Los garajes deben ser un entero")
    .nonnegative("No puede ser negativo"),
  orientation: z.string().trim().min(1, "La orientación es obligatoria"),
  floor: z.string().trim().min(1, "El piso es obligatorio"),
  id_subtype: z.string().trim().min(1, "El subtipo es obligatorio"),
  id_status: z.enum([APARTMENT_STATUS.AVAILABLE, APARTMENT_STATUS.SOLD], {
    error: "Estado inválido",
  }),
});

export type UpdateApartmentFormValues = z.infer<typeof updateApartmentFormSchema>;

type ComparableApartment = {
  total_price: string;
  built_area: string;
  terrace_area: string;
  acue_area: string;
  stair_area: string;
  total_area: string;
  square_meter_price: string;
  bathrooms: string;
  rooms: string;
  garage_spaces: number;
  orientation: string;
  floor: string;
  id_subtype: string;
  id_status: string;
};

/** Builds a PATCH payload containing only fields that actually changed. */
export function buildApartmentPatchPayload(
  original: ComparableApartment,
  values: UpdateApartmentFormValues,
): ApartmentPatchPayload {
  const payload: ApartmentPatchPayload = {};

  const numericEntries = [
    ["total_price", values.total_price, toNumber(original.total_price)],
    ["built_area", values.built_area, toNumber(original.built_area)],
    ["terrace_area", values.terrace_area, toNumber(original.terrace_area)],
    ["acue_area", values.acue_area, toNumber(original.acue_area)],
    ["stair_area", values.stair_area, toNumber(original.stair_area)],
    ["total_area", values.total_area, toNumber(original.total_area)],
    [
      "square_meter_price",
      values.square_meter_price,
      toNumber(original.square_meter_price),
    ],
    ["bathrooms", values.bathrooms, toNumber(original.bathrooms)],
    ["rooms", values.rooms, toNumber(original.rooms)],
    ["garage_spaces", values.garage_spaces, original.garage_spaces],
  ] as const;

  for (const [key, next, previous] of numericEntries) {
    if (previous !== next) {
      payload[key] = next;
    }
  }

  if (values.orientation !== original.orientation) {
    payload.orientation = values.orientation;
  }

  if (values.floor !== original.floor) {
    payload.floor = values.floor;
  }

  if (values.id_subtype !== original.id_subtype) {
    payload.id_subtype = values.id_subtype;
  }

  if (values.id_status !== original.id_status) {
    payload.id_status = values.id_status;
  }

  return payload;
}
