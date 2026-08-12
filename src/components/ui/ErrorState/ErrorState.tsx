import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
};

export function ErrorState({
  title = "Algo salió mal",
  message,
  action,
}: ErrorStateProps) {
  return (
    <div className="rounded-[var(--radius)] border border-danger-border bg-danger-bg px-6 py-8">
      <h3 className="text-base font-semibold text-danger">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
