import { NextResponse } from "next/server";

import { ApiError, parseApiError } from "@/lib/api/api-error";
import { authenticatedBackendFetch } from "@/lib/api/server-api";
import { AUTH_PATHS } from "@/lib/auth/constants";

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

export async function GET() {
  try {
    const response = await authenticatedBackendFetch("/api/v1/apartments", {
      method: "GET",
    });

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
        : "No se pudieron cargar los apartamentos.";

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
