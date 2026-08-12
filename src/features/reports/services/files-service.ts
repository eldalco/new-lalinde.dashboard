import { ApiError, parseApiError } from "@/lib/api/api-error";

export type UploadApartmentsResult = {
  updated: number;
};

function triggerBrowserDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export async function downloadApartmentsExcel(): Promise<void> {
  const response = await fetch("/api/files", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw await parseApiError(response, "No se pudo descargar el archivo Excel.");
  }

  const blob = await response.blob();
  triggerBrowserDownload(blob, "lalinde-apartments.xlsx");
}

export async function uploadApartmentsExcel(
  file: File,
): Promise<UploadApartmentsResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/files", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw await parseApiError(
      response,
      "No se pudo cargar el archivo Excel.",
    );
  }

  const data = (await response.json()) as UploadApartmentsResult;

  if (typeof data.updated !== "number") {
    throw new ApiError({
      statusCode: 502,
      error: "Bad Gateway",
      message: "La respuesta de carga no es válida.",
    });
  }

  return data;
}
