import type { ApiApartment } from "@/features/apartments/types/apartment";
import {
  getStatusLabelFromAvailableStatus,
  getStatusLabelFromId,
} from "@/features/apartments/constants/status";

export type ApartmentStatusLabel = "Vendido" | "Disponible" | "Desconocido";

export type ApartmentListItem = ApiApartment & {
  statusLabel: ApartmentStatusLabel;
  subtypeName: string;
};

export function mapApiApartment(apartment: ApiApartment): ApartmentListItem {
  const statusLabel =
    apartment.Status != null
      ? getStatusLabelFromAvailableStatus(apartment.Status.available_status)
      : getStatusLabelFromId(apartment.id_status);

  return {
    ...apartment,
    statusLabel,
    subtypeName: apartment.Subtype?.subtype_name ?? "—",
  };
}

export function mapApiApartments(
  apartments: ApiApartment[],
): ApartmentListItem[] {
  return apartments.map(mapApiApartment);
}
