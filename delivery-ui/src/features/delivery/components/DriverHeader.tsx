import { Bell, Menu, Bike } from "lucide-react";
import { StatusPill, type StatusTone } from "./StatusPill";
import { driverStatusLabel } from "../labels";
import type { DriverStatus } from "../types";

export const statusTone: Record<DriverStatus, StatusTone> = {
  available: "success",
  delivering: "warning",
  paused: "destructive",
  offline: "muted",
};

export function DriverHeader({
  name,
  role,
  status,
  dateLabel,
  notifications,
}: {
  name: string;
  role: string;
  status: DriverStatus;
  dateLabel: string;
  notifications: number;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          aria-label="القائمة" onClick={() => document.querySelector<HTMLButtonElement>("#osMenu")?.click()}
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Bike className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-lg font-extrabold tracking-tight">
              CARD<span className="text-primary">fy</span>
            </p>
            <p className="hidden text-[10px] text-muted-foreground sm:block">
              Digital Menu, Bigger Business.
            </p>
          </div>
        </div>

        <div className="mx-auto hidden items-center gap-2 md:flex">
          <StatusPill tone={statusTone[status]} label={driverStatusLabel[status]} />
          <p className="text-sm font-semibold">
            مرحباً {name.split(" ")[0]} 👋
            <span className="ms-2 text-xs font-normal text-muted-foreground">{role}</span>
          </p>
        </div>

        <div className="ms-auto flex items-center gap-2">
          <span className="hidden rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground lg:block">
            {dateLabel}
          </span>
          <button
            type="button"
            aria-label="الإشعارات" onClick={() => document.querySelector("#delivery-current")?.scrollIntoView({behavior:"smooth"})}
            className="relative grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="size-5" />
            {notifications > 0 && (
              <span className="absolute -end-1 -top-1 grid size-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {notifications}
              </span>
            )}
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="text-end leading-tight">
              <p className="text-sm font-bold">{name}</p>
              <p className="text-[11px] text-muted-foreground">{driverStatusLabel[status]}</p>
            </div>
            <span className="grid size-10 place-items-center rounded-full bg-elevated text-sm font-bold">
              {name.slice(0, 1)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

