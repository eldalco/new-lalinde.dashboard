import "server-only";

import { getBackendUrl } from "@/config/env";
import { ApiError, parseApiError } from "@/lib/api/api-error";
import { clearSession, getSessionToken } from "@/lib/auth/session";

type AuthenticatedFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  /** When true, 401 clears the session cookie. Default: true */
  clearSessionOnUnauthorized?: boolean;
};

/**
 * Server-only fetch to the Lalinde backend with Bearer token from the HttpOnly cookie.
 */
export async function authenticatedBackendFetch(
  endpoint: string,
  options: AuthenticatedFetchOptions = {},
): Promise<Response> {
  const {
    clearSessionOnUnauthorized = true,
    headers: initHeaders,
    ...rest
  } = options;

  const token = await getSessionToken();

  if (!token) {
    throw new ApiError({
      statusCode: 401,
      error: "Unauthorized",
      message: "Tu sesión ha expirado. Inicia sesión nuevamente.",
    });
  }

  const headers = new Headers(initHeaders);
  headers.set("Authorization", `Bearer ${token}`);

  if (
    rest.body &&
    !(rest.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const url = `${getBackendUrl()}${endpoint}`;
  const response = await fetch(url, {
    ...rest,
    headers,
    cache: "no-store",
  });

  if (response.status === 401 && clearSessionOnUnauthorized) {
    await clearSession();
  }

  return response;
}

export async function authenticatedBackendJson<T>(
  endpoint: string,
  options: AuthenticatedFetchOptions = {},
): Promise<T> {
  const response = await authenticatedBackendFetch(endpoint, options);

  if (!response.ok) {
    throw await parseApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
