import { NextResponse } from "next/server";

import type { ApiApartment } from "@/features/apartments/types/apartment";
import {
  buildApartmentsWorkbook,
  validateApartmentExcelBuffer,
  workbookToArrayBuffer,
} from "@/features/reports/utils/apartment-excel";
import { ApiError, parseApiError } from "@/lib/api/api-error";
import {
  authenticatedBackendFetch,
  authenticatedBackendJson,
} from "@/lib/api/server-api";
import { AUTH_PATHS } from "@/lib/auth/constants";

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

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

function hasAcceptedExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((extension) => lower.endsWith(extension));
}

/**
 * Builds the Excel from live apartments data using the official column layout.
 * The backend /files export currently misaligns columns, so we generate locally.
 */
export async function GET() {
  try {
    const apartments = await authenticatedBackendJson<ApiApartment[]>(
      "/api/v1/apartments",
      { method: "GET" },
    );

    if (!Array.isArray(apartments)) {
      return NextResponse.json(
        {
          statusCode: 502,
          error: "Bad Gateway",
          message: "No se pudo obtener el inventario para exportar.",
        },
        { status: 502 },
      );
    }

    const workbook = buildApartmentsWorkbook(apartments);
    const buffer = workbookToArrayBuffer(workbook);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="lalinde-apartments.xlsx"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof ApiError && error.isUnauthorized) {
      return unauthorizedResponse();
    }

    const message =
      error instanceof Error
        ? error.message
        : "No se pudo descargar el archivo Excel.";

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: "Bad Request",
          message: 'Debes enviar un archivo en el campo "file".',
        },
        { status: 400 },
      );
    }

    if (!hasAcceptedExtension(file.name)) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: "Bad Request",
          message: "Solo se aceptan archivos .xlsx o .xls.",
        },
        { status: 400 },
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: "Bad Request",
          message: "El archivo está vacío.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: "Bad Request",
          message: "El archivo supera el tamaño máximo permitido.",
        },
        { status: 400 },
      );
    }

    const buffer = await file.arrayBuffer();
    const validation = validateApartmentExcelBuffer(buffer);

    if (!validation.ok) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: "Bad Request",
          message: validation.message,
        },
        { status: 400 },
      );
    }

    const upstreamFormData = new FormData();
    upstreamFormData.append(
      "file",
      new Blob([buffer], {
        type:
          file.type ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      file.name,
    );

    const response = await authenticatedBackendFetch("/api/v1/files", {
      method: "POST",
      body: upstreamFormData,
    });

    if (response.status === 401) {
      return unauthorizedResponse();
    }

    if (!response.ok) {
      const apiError = await parseApiError(
        response,
        "No se pudo cargar el archivo Excel.",
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
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError && error.isUnauthorized) {
      return unauthorizedResponse();
    }

    const message =
      error instanceof Error
        ? error.message
        : "No se pudo cargar el archivo Excel.";

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
