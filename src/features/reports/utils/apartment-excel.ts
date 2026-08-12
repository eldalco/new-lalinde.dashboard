import * as XLSX from "xlsx";

import {
  getStatusLabelFromAvailableStatus,
  getStatusLabelFromId,
  isSoldAvailableStatus,
} from "@/features/apartments/constants/status";
import type { ApiApartment } from "@/features/apartments/types/apartment";
import {
  APARTMENT_EXCEL_HEADERS,
  APARTMENT_EXCEL_SHEET_NAME,
  type ApartmentExcelRow,
} from "@/features/reports/constants/excel-columns";
import { toNumber } from "@/lib/utils/numbers";

function toExcelNumber(value: string | number | null | undefined): number {
  return toNumber(value) ?? 0;
}

function toExcelSqmPrice(value: string | number | null | undefined): string {
  const amount = toNumber(value) ?? 0;
  return amount.toFixed(2);
}

function statusLabelForApartment(apartment: ApiApartment): string {
  if (apartment.Status != null) {
    return getStatusLabelFromAvailableStatus(apartment.Status.available_status);
  }

  const label = getStatusLabelFromId(apartment.id_status);
  return label === "Desconocido" ? "Disponible" : label;
}

/**
 * Official mapping used by lalinde-apartments.xlsx:
 * "Area privada" → built_area (not API private_area).
 */
export function mapApartmentToExcelRow(
  apartment: ApiApartment,
): ApartmentExcelRow {
  return [
    apartment.apto_number,
    toExcelNumber(apartment.total_price),
    toExcelNumber(apartment.built_area),
    toExcelNumber(apartment.terrace_area),
    toExcelNumber(apartment.acue_area),
    toExcelNumber(apartment.stair_area),
    toExcelNumber(apartment.total_area),
    toExcelSqmPrice(apartment.square_meter_price),
    toExcelNumber(apartment.bathrooms),
    toExcelNumber(apartment.rooms),
    apartment.garage_spaces ?? 0,
    apartment.orientation ?? "",
    apartment.floor ?? "",
    statusLabelForApartment(apartment),
    apartment.Subtype?.subtype_name ?? "",
  ];
}

/** Sold first, then available; within each group sort by apto_number as plain string. */
export function sortApartmentsForExcel(
  apartments: ApiApartment[],
): ApiApartment[] {
  return [...apartments].sort((a, b) => {
    const aSold = isSoldAvailableStatus(a.Status?.available_status ?? 0);
    const bSold = isSoldAvailableStatus(b.Status?.available_status ?? 0);

    if (aSold !== bSold) {
      return aSold ? -1 : 1;
    }

    // Match official workbook: lexicographic string order (not numeric-aware).
    return a.apto_number.localeCompare(b.apto_number, "en");
  });
}

export function buildApartmentsWorkbook(
  apartments: ApiApartment[],
): XLSX.WorkBook {
  const sorted = sortApartmentsForExcel(apartments);
  const rows: (string | number)[][] = [
    [...APARTMENT_EXCEL_HEADERS],
    ...sorted.map((apartment) => [...mapApartmentToExcelRow(apartment)]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, APARTMENT_EXCEL_SHEET_NAME);

  return workbook;
}

export function workbookToArrayBuffer(workbook: XLSX.WorkBook): ArrayBuffer {
  const raw = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  }) as Buffer;

  return Uint8Array.from(raw).buffer;
}

export function validateApartmentExcelHeaders(
  headers: unknown[],
): { ok: true } | { ok: false; message: string } {
  const normalized = headers.map((header) =>
    typeof header === "string" ? header.trim() : header,
  );

  if (normalized.length < APARTMENT_EXCEL_HEADERS.length) {
    return {
      ok: false,
      message: `El archivo debe tener exactamente ${APARTMENT_EXCEL_HEADERS.length} columnas en el orden oficial.`,
    };
  }

  for (let index = 0; index < APARTMENT_EXCEL_HEADERS.length; index += 1) {
    if (normalized[index] !== APARTMENT_EXCEL_HEADERS[index]) {
      return {
        ok: false,
        message: `Columna ${index + 1} inválida. Se esperaba "${APARTMENT_EXCEL_HEADERS[index]}" y se recibió "${String(normalized[index] ?? "")}".`,
      };
    }
  }

  const extras = normalized
    .slice(APARTMENT_EXCEL_HEADERS.length)
    .filter((value) => value !== null && value !== undefined && value !== "");

  if (extras.length > 0) {
    return {
      ok: false,
      message:
        "El archivo tiene columnas adicionales. Usa exactamente las 15 cabeceras oficiales de Lalinde.",
    };
  }

  return { ok: true };
}

export function validateApartmentExcelBuffer(
  buffer: ArrayBuffer,
): { ok: true; sheetName: string } | { ok: false; message: string } {
  const workbook = XLSX.read(buffer, { type: "array" });

  if (!workbook.SheetNames.includes(APARTMENT_EXCEL_SHEET_NAME)) {
    return {
      ok: false,
      message: `El archivo debe contener la hoja "${APARTMENT_EXCEL_SHEET_NAME}".`,
    };
  }

  const sheet = workbook.Sheets[APARTMENT_EXCEL_SHEET_NAME];
  const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
    header: 1,
    defval: null,
  });

  if (rows.length < 2) {
    return {
      ok: false,
      message: "El archivo no contiene apartamentos para actualizar.",
    };
  }

  const headerValidation = validateApartmentExcelHeaders(rows[0] ?? []);
  if (!headerValidation.ok) {
    return headerValidation;
  }

  return { ok: true, sheetName: APARTMENT_EXCEL_SHEET_NAME };
}
