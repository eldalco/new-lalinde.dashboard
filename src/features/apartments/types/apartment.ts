export interface ApiApartmentStatus {
  id_status: string;
  available_status: number;
}

export interface ApiApartmentSubtype {
  id_subtype: string;
  subtype_name: string;
  id_type: string;
}

/**
 * Apartment as returned by GET /api/v1/apartments.
 * PostgreSQL numeric fields arrive as strings — keep them as strings.
 */
export interface ApiApartment {
  apto_number: string;

  total_price: string;
  built_area: string;
  terrace_area: string;
  acue_area: string;
  stair_area: string;
  total_area: string;
  square_meter_price: string;

  deck_area?: string;
  private_area?: string;
  global_total_area?: string;

  bathrooms: string;
  rooms: string;

  garage_spaces: number;

  orientation: string;
  floor: string;

  id_subtype: string;
  id_status: string;

  Status: ApiApartmentStatus;
  Subtype: ApiApartmentSubtype;
}

/** Fields allowed in PATCH /api/v1/apartments/:apto_number */
export type ApartmentPatchPayload = {
  total_price?: number;
  built_area?: number;
  terrace_area?: number;
  acue_area?: number;
  stair_area?: number;
  total_area?: number;
  square_meter_price?: number;
  bathrooms?: number;
  rooms?: number;
  garage_spaces?: number;
  orientation?: string;
  floor?: string;
  id_subtype?: string;
  id_status?: string;
};
