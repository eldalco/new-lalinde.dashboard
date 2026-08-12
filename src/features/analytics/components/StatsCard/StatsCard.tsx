type StatsCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export function StatsCard({ label, value, hint }: StatsCardProps) {
  return (
    <article className="rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow-sm)] sm:p-5">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </article>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[var(--radius)] border border-border bg-surface p-4 sm:p-5">
      <div className="h-3 w-24 rounded bg-border" />
      <div className="mt-3 h-8 w-32 rounded bg-border" />
      <div className="mt-2 h-3 w-20 rounded bg-border" />
    </div>
  );
}
