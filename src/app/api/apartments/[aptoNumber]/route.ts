import { NextResponse } from "next/server";

import type { ApartmentPatchPayload } from "@/features/apartments/types/apartment";
import { ApiError, parseApiError } from "@/lib/api/api-error";
import { authenticatedBackendFetch } from "@/lib/api/server-api";
import { AUTH_PATHS } from "@/lib/auth/constants";

const ALLOWED_PATCH_KEYS = new Set([
  "total_price",
  "built_area",
  "terrace_area",
  "acue_area",
  "stair_area",
  "total_area",
  "square_meter_price",
  "bathrooms",
  "rooms",
  "garage_spaces",
  "orientation",
  "floor",
  "id_subtype",
  "id_status",
]);

function unauthorizedResponse() {
  return NextResponse.json(
    {
      statusCode: 401,
      error: "Unauthorized",
      message: "Tu sesión ha expirado. Inicia sesión nuevamente.",
      redirectTo: AUTH_PATHS.LOGIN,
    },
    { status: 401 },
  );
}

function sanitizePatchPayload(body: unknown): ApartmentPatchPayload | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const entries = Object.entries(body as Record<string, unknown>).filter(
    ([key]) => ALLOWED_PATCH_KEYS.has(key),
  );

  if (entries.length === 0) {
    return null;
  }

  return Object.fromEntries(entries) as ApartmentPatchPayload;
}

type RouteContext = {
  params: Promise<{ aptoNumber: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { aptoNumber: rawAptoNumber } = await context.params;
  const aptoNumber = decodeURIComponent(rawAptoNumber);

  if (!aptoNumber) {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: "El número de apartamento es obligatorio.",
      },
      { status: 400 },
    );
  }

  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: "El cuerpo de la solicitud no es JSON válido.",
      },
      { status: 400 },
    );
  }

  const payload = sanitizePatchPayload(json);

  if (!payload) {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: "No hay campos válidos para actualizar.",
      },
      { status: 400 },
    );
  }

  try {
    const response = await authenticatedBackendFetch(
      `/api/v1/apartments/${encodeURIComponent(aptoNumber)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );

    if (response.status === 401) {
      return unauthorizedResponse();
    }

    if (!response.ok) {
      const apiError = await parseApiError(response);
      return NextResponse.json(
        {
          statusCode: apiError.statusCode,
          error: apiError.error,
          message: apiError.message,
        },
        { status: apiError.statusCode },
      );
    }

    const data: unknown = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError && error.isUnauthorized) {
      return unauthorizedResponse();
    }

    const message =
      error instanceof Error
        ? error.message
        : "No se pudo actualizar el apartamento.";

    return NextResponse.json(
      {
        statusCode: 500,
        error: "Internal Server Error",
        message,
      },
      { status: 500 },
    );
  }
}
