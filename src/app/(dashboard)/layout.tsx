import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AUTH_PATHS } from "@/lib/auth/constants";
import {
  getSessionUsername,
  hasSession,
} from "@/lib/auth/session";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const authenticated = await hasSession();

  if (!authenticated) {
    redirect(AUTH_PATHS.LOGIN);
  }

  const username = (await getSessionUsername()) ?? "Usuario";

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header username={username} sectionLabel="Inventario" />
      {children}
      <Footer />
    </div>
  );
}
