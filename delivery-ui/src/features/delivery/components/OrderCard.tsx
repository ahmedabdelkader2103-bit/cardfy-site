import {
  ChevronDown,
  CreditCard,
  MapPin,
  Map as MapIcon,
  Phone,
  StickyNote,
  User,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill, type StatusTone } from "./StatusPill";
import { OtpPanel } from "./OtpPanel";
import { egp, orderStatusLabel } from "../labels";
import type { DeliveryOrder, OrderStatus } from "../types";
import { cn } from "@/lib/utils";

const orderTone: Record<OrderStatus, StatusTone> = {
  assigned: "muted",
  on_the_way: "info",
  out_for_delivery: "destructive",
  delivered: "success",
};

export function OrderCard({
  order,
  expanded,
  onToggle,
  onConfirmOtp,
  onFallback,
  readOnly = false,
  onPickup, onIssue, busy = false,
}: {
  order: DeliveryOrder;
  expanded: boolean;
  onToggle: () => void;
  onConfirmOtp?: (code: string) => Promise<unknown>;
  onFallback?: () => void;
  readOnly?: boolean;
  busy?: boolean;
  onIssue?: () => void;
  onPickup?: () => Promise<unknown>;
}) {
  const paid = order.paymentState === "paid";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border bg-card transition-colors",
        expanded ? "border-primary/50" : "border-border",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 p-3 text-start"
      >
        <span className="h-12 w-1 shrink-0 rounded-full bg-primary" />
        <div className="min-w-0 leading-tight">
          <p className="text-sm font-extrabold">{order.code}</p>
          <p className="text-[11px] text-muted-foreground">{order.time}</p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="size-3" />
            {order.distanceKm === null ? "المسافة غير متاحة" : `${order.distanceKm} كم`}
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{order.customerName}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {order.items.length} عناصر · {order.paymentLabel}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <StatusPill tone={orderTone[order.status]} label={orderStatusLabel[order.status]} />
          <p className="text-sm font-extrabold">{egp(order.total)}</p>
        </div>

        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded && (
        <div className="space-y-3 border-t border-border p-3">
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="space-y-2 rounded-xl bg-elevated/60 p-3">
              <p className="flex items-center gap-2 text-sm font-bold">
                <User className="size-4 text-primary" />
                {order.customerName}
              </p>
              <p dir="ltr" className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                {order.phone}
                <Phone className="size-4 text-primary" />
              </p>
              <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {order.address}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button variant="whatsapp" className="h-11 flex-1" asChild>
                  <a href={`https://wa.me/${order.whatsapp}`} target="_blank" rel="noreferrer">
                    واتساب
                  </a>
                </Button>
                <Button variant="call" className="h-11 flex-1" asChild>
                  <a href={`tel:${order.phone}`}>
                    <Phone className="size-4" />
                    اتصال
                  </a>
                </Button>
                <Button variant="map" className="h-11 flex-1" asChild>
                  <a href={order.mapsUrl} target="_blank" rel="noreferrer">
                    <MapIcon className="size-4" />
                    فتح في الخرائط
                  </a>
                </Button>
              </div>
            </div>

            <div className="space-y-2 rounded-xl bg-elevated/60 p-3">
              <p className="text-sm font-bold">{order.items.length} عناصر</p>
              <ul className="space-y-1.5">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-card px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden>{item.emoji}</span>
                      {item.name}
                    </span>
                    <span className="text-muted-foreground">× {item.quantity}</span>
                  </li>
                ))}
              </ul>
              {order.notes && (
                <p className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-2 text-xs text-warning">
                  <StickyNote className="mt-0.5 size-3.5 shrink-0" />
                  {order.notes}
                </p>
              )}
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>رسوم التوصيل</dt>
                  <dd>{egp(order.deliveryFee)}</dd>
                </div>
                <div className="flex justify-between font-extrabold">
                  <dt>إجمالي الفاتورة</dt>
                  <dd>{egp(order.total)}</dd>
                </div>
              </dl>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <StatusPill
                  tone={order.paymentMethod === "online" ? "info" : "warning"}
                  withDot={false}
                  label={order.paymentLabel}
                />
                <StatusPill
                  tone={paid ? "success" : "destructive"}
                  withDot={false}
                  label={paid ? "تم التحصيل" : `مطلوب تحصيل ${egp(order.total)}`}
                />
                <span className="ms-auto text-muted-foreground">
                  {order.paymentMethod === "online" ? (
                    <CreditCard className="size-4" />
                  ) : (
                    <Wallet className="size-4" />
                  )}
                </span>
              </div>
            </div>
          </div>

          {onIssue && !order.closed && <Button variant="secondary" disabled={busy} onClick={onIssue}>تسجيل مشكلة</Button>}
          {!readOnly && onPickup && <Button className="h-12 w-full" disabled={busy} onClick={() => { void onPickup().catch(() => {}); }}>استلمت الطلب من المطعم</Button>}
          {!readOnly && onConfirmOtp && onFallback && (
            <OtpPanel onConfirm={onConfirmOtp} onFallback={onFallback} busy={busy} />
          )}
        </div>
      )}
    </article>
  );
}

