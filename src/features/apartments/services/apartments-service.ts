import { ApiError, parseApiError } from "@/lib/api/api-error";
import type {
  ApartmentPatchPayload,
  ApiApartment,
} from "@/features/apartments/types/apartment";

async function ensureOk(response: Response): Promise<void> {
  if (!response.ok) {
    throw await parseApiError(response);
  }
}

export async function fetchApartments(): Promise<ApiApartment[]> {
  const response = await fetch("/api/apartments", {
    method: "GET",
    cache: "no-store",
  });

  await ensureOk(response);

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new ApiError({
      statusCode: 502,
      error: "Bad Gateway",
      message: "La respuesta de apartamentos no es válida.",
    });
  }

  return data as ApiApartment[];
}

export async function patchApartment(
  aptoNumber: string,
  payload: ApartmentPatchPayload,
): Promise<ApiApartment> {
  const response = await fetch(
    `/api/apartments/${encodeURIComponent(aptoNumber)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  await ensureOk(response);

  return (await response.json()) as ApiApartment;
}
