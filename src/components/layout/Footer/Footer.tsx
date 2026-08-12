export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/80">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-4 text-xs text-muted sm:px-6 lg:px-8 xl:px-10">
        <span>Lalinde · Inventario inmobiliario Korn Group</span>
        <span>© {year}</span>
      </div>
    </footer>
  );
}
