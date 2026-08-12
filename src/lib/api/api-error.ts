export class ApiError extends Error {
  readonly statusCode: number;
  readonly error: string;
  readonly details: unknown;

  constructor(options: {
    statusCode: number;
    message: string;
    error?: string;
    details?: unknown;
  }) {
    super(options.message);
    this.name = "ApiError";
    this.statusCode = options.statusCode;
    this.error = options.error ?? "Error";
    this.details = options.details;
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isConflict(): boolean {
    return this.statusCode === 409;
  }

  get isValidationError(): boolean {
    return this.statusCode === 400;
  }

  get isRateLimited(): boolean {
    return this.statusCode === 429;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

type BackendErrorBody = {
  statusCode?: number;
  error?: string;
  message?: string | string[];
};

function messageFromBody(body: BackendErrorBody, fallback: string): string {
  if (Array.isArray(body.message)) {
    return body.message.filter(Boolean).join(". ") || fallback;
  }

  if (typeof body.message === "string" && body.message.trim()) {
    return body.message;
  }

  return fallback;
}

export async function parseApiError(
  response: Response,
  fallbackMessage = "Ocurrió un error inesperado",
): Promise<ApiError> {
  let body: BackendErrorBody = {};

  try {
    body = (await response.json()) as BackendErrorBody;
  } catch {
    body = {};
  }

  return new ApiError({
    statusCode: body.statusCode ?? response.status,
    error: body.error ?? response.statusText ?? "Error",
    message: messageFromBody(body, fallbackMessage),
    details: body,
  });
}

/** User-facing message mapped from HTTP status when backend message is weak. */
export function getUserFacingErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 400:
        return error.message || "Los datos enviados no son válidos.";
      case 401:
        return "Tu sesión ha expirado. Inicia sesión nuevamente.";
      case 403:
        return "No tienes permisos para realizar esta acción.";
      case 404:
        return "No se encontró el recurso solicitado.";
      case 409:
        return error.message || "Hay un conflicto con el estado actual.";
      case 429:
        return "Demasiadas solicitudes. Intenta de nuevo en unos momentos.";
      default:
        if (error.isServerError) {
          return "Error interno del servidor. Intenta más tarde.";
        }
        return error.message || "Ocurrió un error inesperado.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}
