import { ChevronLeft, ListOrdered } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function QueueCard({ position, total }: { position: number | null; total: number }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-3 py-3 text-start transition-colors hover:bg-elevated"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <ListOrdered className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-lg font-extrabold text-primary">{position === null ? "غير متاح" : `# ${position}`}</p>
            <p className="text-[11px] text-muted-foreground">الدور الحالي في قائمة التوصيل</p>
          </div>
          <ChevronLeft className="ms-auto size-5 text-muted-foreground" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-start">
          <DrawerTitle>الدور الحالي</DrawerTitle>
          <DrawerDescription>ترتيبك بين السائقين المتاحين الآن.</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-2 px-4 pb-8">
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm ${
                n === position
                  ? "border-primary/40 bg-primary/10 font-bold text-primary"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              <span># {n}</span>
              <span>{n === position ? "دورك أنت" : "سائق آخر"}</span>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

