import { useMemo, useState, useEffect, useRef } from "react";
import { CheckCircle2, ClipboardList, Filter, History, Search } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DriverHeader } from "@/features/delivery/components/DriverHeader";
import { StatsStrip } from "@/features/delivery/components/StatsStrip";
import { ShiftControls } from "@/features/delivery/components/ShiftControls";
import { QueueCard } from "@/features/delivery/components/QueueCard";
import { OrderCard } from "@/features/delivery/components/OrderCard";
import { IssueDialog } from "@/features/delivery/components/IssueDialog";
import { FallbackDialog } from "@/features/delivery/components/FallbackDialog";
import { useDelivery } from "@/integration";
import { fallbackReasons, egp } from "@/features/delivery/labels";
import type { DeliveryOrder, DriverStatus } from "@/features/delivery/types";

type Filter = "all" | "out_for_delivery" | "near";

export default function DeliveryDriverPage() {
  const { driver, orders, completed, loading, error, busy, refresh, action, shift } = useDelivery();
  const status = driver.status;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [issueFor, setIssueFor] = useState<DeliveryOrder | null>(null);
  const [fallbackFor, setFallbackFor] = useState<DeliveryOrder | null>(null);
  const initialized = useRef(false);
  useEffect(() => { if (orders.length && !initialized.current) { initialized.current = true; setExpandedId(orders[0].id); } else if (expandedId && !expandedId.startsWith("done-") && !orders.some(o => o.id === expandedId)) setExpandedId(orders[0]?.id || null); }, [orders, expandedId]);

  const visibleOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesQuery =
        !query ||
        order.code.includes(query) ||
        order.customerName.includes(query) ||
        order.phone.includes(query);
      const matchesFilter =
        filter === "all" ||
        (filter === "out_for_delivery" && ["on_the_way", "out_for_delivery"].includes(order.status)) ||
        (filter === "near" && order.distanceKm !== null && order.distanceKm <= 3);
      return matchesQuery && matchesFilter;
    });
  }, [orders, query, filter]);

  const handleConfirmOtp = async (order: DeliveryOrder, code: string) => {
    await action(order.id, "delivered", { otp: code });
    toast.success("تم تسليم الطلب بنجاح");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background pb-8">
      <Toaster position="top-center" />
      <DriverHeader
        name={driver.name}
        role={driver.role}
        status={status}
        dateLabel={new Date().toLocaleDateString("ar-EG", { dateStyle: "full", timeZone: "Africa/Cairo" })}
        notifications={orders.length}
      />

      <main className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4">
        {error && <p role="alert" className="rounded-xl border border-destructive p-3 text-destructive">{error} <Button variant="secondary" onClick={refresh}>إعادة المحاولة</Button></p>}
        {loading && <p role="status">جاري تحميل طلباتك…</p>}
        <StatsStrip {...driver.stats} />

        <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
          <QueueCard position={driver.queuePosition} total={driver.queueTotal} />
          <ShiftControls
            status={status}
            shiftStartedAt={driver.shiftStartedAt}
            onToggleAvailable={(next) => shift(next ? "available" : "paused")}
            onTogglePause={() => shift(status === "paused" ? "available" : "paused")}
            onEndShift={() => shift("offline")}
          />
        </div>

        <Tabs defaultValue="current" className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 id="delivery-current" className="text-lg font-extrabold">الطلبات المخصصة لي</h1>
              <p className="text-xs text-muted-foreground">اضغط على أي طلب لعرض التفاصيل.</p>
            </div>
            <TabsList className="h-11 w-full sm:w-auto">
              <TabsTrigger value="current" className="flex-1 gap-2">
                <ClipboardList className="size-4" />
                الحالية ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="today" className="flex-1 gap-2">
                <History className="size-4" />
                اليوم ({completed.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="current" className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث برقم الطلب أو اسم العميل ..."
                  className="h-11 pe-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {(
                  [
                    ["all", `الكل (${orders.length})`],
                    [
                      "out_for_delivery",
                      `قيد التوصيل (${orders.filter((o) => ["on_the_way", "out_for_delivery"].includes(o.status)).length})`,
                    ],
                    ["near", "قريب مني"],
                  ] as [Filter, string][]
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    variant={filter === value ? "default" : "secondary"}
                    className="h-11 shrink-0"
                    onClick={() => setFilter(value)}
                  >
                    {label}
                  </Button>
                ))}
                <Button variant="secondary" size="icon" className="h-11 w-11 shrink-0" aria-label="تحديث الطلبات" onClick={refresh}>
                  <Filter className="size-4" />
                </Button>
              </div>
            </div>

            {visibleOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <CheckCircle2 className="mx-auto size-8 text-success" />
                <p className="mt-2 text-sm font-bold">لا توجد طلبات مطابقة حالياً</p>
                <p className="text-xs text-muted-foreground">ستظهر الطلبات الجديدة هنا فور تخصيصها لك.</p>
              </div>
            ) : (
              visibleOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  expanded={expandedId === order.id}
                  onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  onIssue={() => setIssueFor(order)}
                  onConfirmOtp={order.status === "on_the_way" ? (code) => handleConfirmOtp(order, code) : undefined}
                  onPickup={order.status === "assigned" ? () => action(order.id, "picked_up", {}) : undefined}
                  busy={busy}
                  onFallback={order.status === "on_the_way" ? () => setFallbackFor(order) : undefined}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="today" className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm">
              <span className="font-bold">طلبات تم تسليمها اليوم</span>
              <span className="text-muted-foreground">
                {completed.length} طلب · {egp(completed.reduce((sum, o) => sum + o.total, 0))}
              </span>
            </div>
            {completed.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                readOnly
                onIssue={() => setIssueFor(order)}
                expanded={expandedId === `done-${order.id}`}
                onToggle={() =>
                  setExpandedId(expandedId === `done-${order.id}` ? null : `done-${order.id}`)
                }
              />
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <IssueDialog open={Boolean(issueFor)} orderCode={issueFor?.code} busy={busy} onOpenChange={open => !open && setIssueFor(null)} onConfirm={async text => { if(!issueFor)return;await action(issueFor.id,"issue",{text});setIssueFor(null);toast.success("تم تسجيل المشكلة");}}/>
      <FallbackDialog
        open={Boolean(fallbackFor)}
        orderCode={fallbackFor?.code}
        onOpenChange={(open) => !open && setFallbackFor(null)}
        busy={busy}
        onConfirm={async (reason, note) => {
          if (!fallbackFor) return;
          const label = fallbackReasons.find(item => item.value === reason)?.label || reason;
          await action(fallbackFor.id, "delivery_exception", { reason: label + (note ? " — " + note : ""), confirmed: true });
          setFallbackFor(null);
          toast.success("تم تسجيل التسليم الاستثنائي", { description: "بانتظار تأكيد العميل من صفحة متابعة الطلب." });
        }}
      />

    </div>
  );
}

