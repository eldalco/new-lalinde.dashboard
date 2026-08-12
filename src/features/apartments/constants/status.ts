export const APARTMENT_STATUS = {
  SOLD: "ed9mFO6m0t6wwslfFNpK2",
  AVAILABLE: "ixwg6sHWMfBYyXwKnIrmk",
} as const;

export type ApartmentStatusId =
  (typeof APARTMENT_STATUS)[keyof typeof APARTMENT_STATUS];

export const APARTMENT_STATUS_LABEL = {
  [APARTMENT_STATUS.SOLD]: "Vendido",
  [APARTMENT_STATUS.AVAILABLE]: "Disponible",
} as const;

/** Backend available_status flag */
export const AVAILABLE_STATUS = {
  AVAILABLE: 0,
  SOLD: 1,
} as const;

export function getStatusLabelFromAvailableStatus(
  availableStatus: number,
): "Vendido" | "Disponible" {
  return availableStatus === AVAILABLE_STATUS.SOLD ? "Vendido" : "Disponible";
}

export function getStatusLabelFromId(
  idStatus: string,
): "Vendido" | "Disponible" | "Desconocido" {
  if (idStatus === APARTMENT_STATUS.SOLD) {
    return "Vendido";
  }

  if (idStatus === APARTMENT_STATUS.AVAILABLE) {
    return "Disponible";
  }

  return "Desconocido";
}

export function isSoldAvailableStatus(availableStatus: number): boolean {
  return availableStatus === AVAILABLE_STATUS.SOLD;
}

export function isAvailableAvailableStatus(availableStatus: number): boolean {
  return availableStatus === AVAILABLE_STATUS.AVAILABLE;
}
