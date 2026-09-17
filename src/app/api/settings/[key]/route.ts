import { NextResponse } from "next/server";

import { getBackendUrl } from "@/config/env";
import { SETTINGS_KEYS } from "@/features/settings/constants";
import { ApiError, parseApiError } from "@/lib/api/api-error";
import { authenticatedBackendFetch } from "@/lib/api/server-api";
import { AUTH_PATHS } from "@/lib/auth/constants";

const ALLOWED_KEYS = new Set<string>(Object.values(SETTINGS_KEYS));

type RouteContext = {
  params: Promise<{ key: string }>;
};

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

function isAllowedKey(key: string): boolean {
  return ALLOWED_KEYS.has(key);
}

/** Public read — no JWT required by the backend. */
export async function GET(_request: Request, context: RouteContext) {
  const { key } = await context.params;

  if (!isAllowedKey(key)) {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: `Clave de configuración no válida: ${key}`,
      },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/settings/${encodeURIComponent(key)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const apiError = await parseApiError(
        response,
        "No se pudo cargar la configuración.",
      );
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
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo cargar la configuración.";

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

/** Admin write — JWT from HttpOnly cookie. Body must be exactly `{ value: boolean }`. */
export async function PATCH(request: Request, context: RouteContext) {
  const { key } = await context.params;

  if (!isAllowedKey(key)) {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: `Clave de configuración no válida: ${key}`,
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

  if (
    !json ||
    typeof json !== "object" ||
    Array.isArray(json) ||
    !("value" in json)
  ) {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: 'El cuerpo debe ser exactamente { "value": boolean }.',
      },
      { status: 400 },
    );
  }

  const body = json as Record<string, unknown>;
  const keys = Object.keys(body);

  if (keys.length !== 1 || keys[0] !== "value") {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message:
          "El cuerpo solo puede incluir la clave value. Cualquier otra clave es inválida.",
      },
      { status: 400 },
    );
  }

  if (typeof body.value !== "boolean") {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: "value debe ser un booleano JSON (true o false).",
      },
      { status: 400 },
    );
  }

  try {
    const response = await authenticatedBackendFetch(
      `/api/v1/settings/${encodeURIComponent(key)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ value: body.value }),
      },
    );

    if (response.status === 401) {
      return unauthorizedResponse();
    }

    if (!response.ok) {
      const apiError = await parseApiError(
        response,
        "No se pudo actualizar la configuración.",
      );
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
        : "No se pudo actualizar la configuración.";

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
