type UserMenuProps = {
  username: string;
};

export function UserMenu({ username }: UserMenuProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-xs text-muted">Sesión activa</p>
        <p className="text-sm font-medium text-foreground">{username}</p>
      </div>
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
        aria-hidden
      >
        {username.slice(0, 1).toUpperCase()}
      </div>
    </div>
  );
}
