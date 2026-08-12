"use client";

import { Toaster } from "sonner";
import type { ReactNode } from "react";

import { QueryProvider } from "@/providers/QueryProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          className: "font-sans",
        }}
      />
    </QueryProvider>
  );
}
