import { NextResponse } from "next/server";

import { getBackendUrl } from "@/config/env";
import { loginSchema } from "@/features/auth/schemas/login-schema";
import { parseApiError } from "@/lib/api/api-error";
import { setSession } from "@/lib/auth/session";

type BackendLoginResponse = {
  token?: string;
};

export async function POST(request: Request) {
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

  const parsed = loginSchema.safeParse(json);

  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(". ");

    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: message || "Datos de inicio de sesión inválidos.",
      },
      { status: 400 },
    );
  }

  const { username, password } = parsed.data;

  const backendResponse = await fetch(
    `${getBackendUrl()}/api/v1/users/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    },
  );

  if (!backendResponse.ok) {
    const apiError = await parseApiError(
      backendResponse,
      "Usuario o contraseña incorrectos.",
    );

    return NextResponse.json(
      {
        statusCode: apiError.statusCode,
        error: apiError.error,
        message:
          apiError.statusCode === 401
            ? "Usuario o contraseña incorrectos."
            : apiError.message,
      },
      { status: apiError.statusCode },
    );
  }

  const body = (await backendResponse.json()) as BackendLoginResponse;

  if (!body.token) {
    return NextResponse.json(
      {
        statusCode: 502,
        error: "Bad Gateway",
        message: "La autenticación no devolvió un token válido.",
      },
      { status: 502 },
    );
  }

  await setSession(body.token, username);

  return NextResponse.json({
    ok: true,
    username,
  });
}
