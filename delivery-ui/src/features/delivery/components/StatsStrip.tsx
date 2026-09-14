import { Bike, CheckCircle2, Clock, Route } from "lucide-react";
import type { LucideIcon } from "lucide-react";

function StatCard({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-3">
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-xl font-extrabold">{value}</p>
        <p className="truncate text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function StatsStrip({
  currentOrders,
  deliveredToday,
  avgDeliveryMinutes,
  distanceTodayKm,
}: {
  currentOrders: number;
  deliveredToday: number;
  avgDeliveryMinutes: number | null;
  distanceTodayKm: number | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        icon={Bike}
        value={String(currentOrders)}
        label="طلباتي الحالية"
        tone="bg-primary/15 text-primary"
      />
      <StatCard
        icon={CheckCircle2}
        value={String(deliveredToday)}
        label="تم التسليم اليوم"
        tone="bg-success/15 text-success"
      />
      <StatCard
        icon={Clock}
        value={avgDeliveryMinutes === null ? "—" : `${avgDeliveryMinutes} دقيقة`}
        label="متوسط وقت التوصيل"
        tone="bg-info/15 text-info"
      />
      <StatCard
        icon={Route}
        value={distanceTodayKm === null ? "—" : `${distanceTodayKm} كم`}
        label="المسافة اليوم"
        tone="bg-warning/15 text-warning"
      />
    </div>
  );
}

