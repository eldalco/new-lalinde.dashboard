import "server-only";

import { cookies } from "next/headers";

import { isProduction } from "@/config/env";
import {
  AUTH_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/constants";

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE.TOKEN)?.value;

  return token && token.length > 0 ? token : null;
}

export async function getSessionUsername(): Promise<string | null> {
  const cookieStore = await cookies();
  const username = cookieStore.get(AUTH_COOKIE.USERNAME)?.value;

  return username && username.length > 0 ? username : null;
}

export async function hasSession(): Promise<boolean> {
  const token = await getSessionToken();
  return Boolean(token);
}

export async function setSession(token: string, username: string): Promise<void> {
  const cookieStore = await cookies();
  const options = baseCookieOptions();

  cookieStore.set(AUTH_COOKIE.TOKEN, token, options);
  cookieStore.set(AUTH_COOKIE.USERNAME, username, options);
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIE.TOKEN);
  cookieStore.delete(AUTH_COOKIE.USERNAME);
}
