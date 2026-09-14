import { LogOut, Pause, Play } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { driverStatusLabel } from "../labels";
import type { DriverStatus } from "../types";

export function ShiftControls({
  status,
  onToggleAvailable,
  onTogglePause,
  onEndShift,
  shiftStartedAt,
}: {
  status: DriverStatus;
  onToggleAvailable: (next: boolean) => void;
  onTogglePause: () => void;
  onEndShift: () => void;
  shiftStartedAt: string;
}) {
  const offline = status === "offline";
  const paused = status === "paused";

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-3 rounded-xl bg-success/10 px-3 py-2">
        <span className="flex items-center gap-2 text-sm font-bold text-success">
          <span className="size-2.5 rounded-full bg-success" />
          {offline ? driverStatusLabel.offline : driverStatusLabel[status]}
        </span>
        <Switch
          checked={!offline && !paused}
          onCheckedChange={onToggleAvailable}
          aria-label="تبديل التوفر"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="h-11 flex-1 justify-between"
          onClick={onTogglePause}
          disabled={offline}
        >
          <span>{paused ? "استئناف العمل" : "إيقاف مؤقت"}</span>
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </Button>
        <Button
          variant="destructive"
          className="h-11 flex-1 justify-between"
          onClick={onEndShift}
          disabled={offline}
        >
          <span>إنهاء الشيفت</span>
          <LogOut className="size-4" />
        </Button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground">
        {shiftStartedAt}
      </p>
    </div>
  );
}

