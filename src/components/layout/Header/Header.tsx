import { LogoutButton } from "@/components/layout/LogoutButton";
import { UserMenu } from "@/components/layout/UserMenu";

type HeaderProps = {
  username: string;
  sectionLabel?: string;
};

export function Header({
  username,
  sectionLabel = "Dashboard",
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-surface shadow-[var(--shadow-sm)]">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-tight text-primary">
            Morph Lalinde
          </p>
          <p className="truncate text-xs text-muted">{sectionLabel}</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <UserMenu username={username} />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
