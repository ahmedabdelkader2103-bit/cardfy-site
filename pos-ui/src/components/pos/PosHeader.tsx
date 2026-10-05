import { Bell, CalendarDays, ChefHat, Menu, Search } from "lucide-react";

export function PosHeader({actorName,actorRole,pendingCount,onMenu,onBell,onSearch}:{actorName:string;actorRole:string;pendingCount:number;onMenu:()=>void;onBell:()=>void;onSearch:(value:string)=>void}) {
  const now = new Intl.DateTimeFormat("ar-EG",{timeZone:"Africa/Cairo",weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date());

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-surface/80 backdrop-blur-xl">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:px-5 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="القائمة"
            onClick={onMenu}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl brand-gradient text-brand-foreground">
              <ChefHat className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-lg font-extrabold tracking-tight">
                CARD<span className="text-brand">fy</span>
              </p>
              <p className="hidden text-[11px] text-muted-foreground sm:block">Restaurant POS</p>
            </div>
          </div>
        </div>

        <div className="relative hidden min-w-0 md:block">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            onChange={(event)=>onSearch(event.target.value)}
            placeholder="ابحث عن منتج، صنف، أو استخدم الكود ..."
            className="h-11 w-full rounded-xl border border-border bg-surface-2/70 pr-10 pl-16 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand/60"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 rounded-md bg-surface-3 px-2 py-0.5 text-[11px] text-muted-foreground">
            Ctrl + K
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-border bg-surface-2/70 px-3 py-2 text-xs text-muted-foreground xl:flex">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">{now}</span>
          </div>
          <button
            type="button"
            aria-label="الإشعارات"
            onClick={onBell}
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            {pendingCount>0&&<span className="absolute -top-1 -left-1 grid h-5 w-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">{pendingCount>99?"99+":pendingCount}</span>}
          </button>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2/70 px-2 py-1.5 sm:px-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-3 text-xs font-bold">
              {actorName.trim().split(/\s+/).slice(0,2).map(v=>v[0]).join("")||"C"}
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-bold">{actorName}</p>
              <p className="text-[11px] text-muted-foreground">{actorRole}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
