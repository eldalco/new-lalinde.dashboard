/** Exact Excel headers used by the official Lalinde apartments workbook. */
export const APARTMENT_EXCEL_HEADERS = [
  "Numero de apartamento",
  "Precio total",
  "Area privada",
  "Area Publica",
  "Area Acue",
  "Area escalera",
  "Area total",
  "Precio de metro cuadrado",
  "Baños",
  "Cuartos",
  "Garajes",
  "Orientación",
  "Piso(s)",
  "Estado",
  "Subtipo",
] as const;

export const APARTMENT_EXCEL_SHEET_NAME = "Apartments";

export type ApartmentExcelHeader = (typeof APARTMENT_EXCEL_HEADERS)[number];

export type ApartmentExcelRow = [
  string, // Numero de apartamento
  number, // Precio total
  number, // Area privada (built_area)
  number, // Area Publica (terrace_area)
  number, // Area Acue
  number, // Area escalera
  number, // Area total
  string, // Precio de metro cuadrado
  number, // Baños
  number, // Cuartos
  number, // Garajes
  string, // Orientación
  string, // Piso(s)
  string, // Estado
  string, // Subtipo
];
