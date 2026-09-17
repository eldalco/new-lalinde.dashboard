import { ApiError, parseApiError } from "@/lib/api/api-error";
import { SETTINGS_KEYS } from "@/features/settings/constants";
import type { ApiSetting } from "@/features/settings/types/setting";

function assertBooleanSetting(data: ApiSetting): ApiSetting {
  if (typeof data.value !== "boolean") {
    throw new ApiError({
      statusCode: 502,
      error: "Bad Gateway",
      message:
        "La configuración de precios no devolvió un booleano válido.",
    });
  }

  return data;
}

export async function fetchPricesVisibleSetting(): Promise<ApiSetting> {
  const response = await fetch(
    `/api/settings/${SETTINGS_KEYS.PRICES_VISIBLE}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      "No se pudo cargar la visibilidad de precios.",
    );
  }

  const data = (await response.json()) as ApiSetting;
  return assertBooleanSetting(data);
}

export async function updatePricesVisibleSetting(
  value: boolean,
): Promise<ApiSetting> {
  const response = await fetch(
    `/api/settings/${SETTINGS_KEYS.PRICES_VISIBLE}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      "No se pudo actualizar la visibilidad de precios.",
    );
  }

  const data = (await response.json()) as ApiSetting;
  return assertBooleanSetting(data);
}
