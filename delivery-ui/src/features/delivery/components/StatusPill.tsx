import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "destructive" | "muted" | "info" | "primary";

const toneClasses: Record<Tone, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
  muted: "bg-muted text-muted-foreground border-border",
  info: "bg-info/15 text-info border-info/30",
  primary: "bg-primary/15 text-primary border-primary/30",
};

const dotClasses: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground",
  info: "bg-info",
  primary: "bg-primary",
};

export function StatusPill({
  tone,
  label,
  withDot = true,
  className,
}: {
  tone: Tone;
  label: string;
  withDot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {withDot && <span className={cn("size-2 rounded-full", dotClasses[tone])} />}
      {label}
    </span>
  );
}

export type { Tone as StatusTone };

