import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { SessionExpiredNotice } from "@/features/auth/components/SessionExpiredNotice/SessionExpiredNotice";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-[var(--radius)] border border-border bg-surface p-8 shadow-[var(--shadow-md)]">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Lalinde
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-muted">
            Accede al panel de inventario inmobiliario.
          </p>
        </div>
        <Suspense fallback={null}>
          <SessionExpiredNotice />
        </Suspense>
        <LoginForm />
      </div>
    </main>
  );
}
