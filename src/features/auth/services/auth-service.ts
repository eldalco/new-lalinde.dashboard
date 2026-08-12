import { ApiError, parseApiError } from "@/lib/api/api-error";
import type { LoginInput } from "@/features/auth/schemas/login-schema";
import type {
  LoginResponse,
  LogoutResponse,
} from "@/features/auth/types/auth";

async function readError(response: Response): Promise<ApiError> {
  return parseApiError(
    response,
    "No se pudo completar la autenticación.",
  );
}

export async function loginRequest(
  input: LoginInput,
): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await readError(response);
  }

  return (await response.json()) as LoginResponse;
}

export async function logoutRequest(): Promise<LogoutResponse> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw await readError(response);
  }

  return (await response.json()) as LogoutResponse;
}
