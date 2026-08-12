export function ApartmentsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-[var(--shadow-sm)]">
      <div className="animate-pulse space-y-0">
        <div className="h-11 border-b border-border bg-surface-muted" />
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0"
          >
            <div className="h-4 w-20 rounded bg-border" />
            <div className="h-4 w-28 rounded bg-border" />
            <div className="hidden h-4 w-24 rounded bg-border sm:block" />
            <div className="ml-auto h-4 w-16 rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}
