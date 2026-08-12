import { redirect } from "next/navigation";

import { AUTH_PATHS } from "@/lib/auth/constants";
import { hasSession } from "@/lib/auth/session";

export default async function HomePage() {
  const authenticated = await hasSession();

  redirect(authenticated ? AUTH_PATHS.DASHBOARD : AUTH_PATHS.LOGIN);
}
