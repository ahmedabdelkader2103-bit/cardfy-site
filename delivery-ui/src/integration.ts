import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { DeliveryOrder, DriverStatus } from "./features/delivery/types";
export function mapDeliveryOrder(o: any): DeliveryOrder {
  const phone = String(o.phone || "").replace(/[^+\d]/g, "");
  return {
    closed: ["completed", "cancelled"].includes(o.status),
    id: o.id,
    code: o.reference,
    time: new Date(o.created_at).toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Cairo",
    }),
    status:
      o.status === "ready"
        ? "assigned"
        : ["delivered", "completed"].includes(o.status)
          ? "delivered"
          : "on_the_way",
    customerName: o.customer_name || "عميل",
    phone,
    whatsapp: String(o.whatsapp || phone)
      .replace(/\D/g, "")
      .replace(/^0/, "20"),
    address: o.address || "العنوان غير متاح",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(o.address || ""),
    distanceKm: null,
    items: (o.items || []).map((i: any) => ({
      id: i.id,
      name: [
        i.snapshot?.product?.name_ar || i.snapshot?.product?.name_en || "منتج",
        i.snapshot?.variant?.name,
        ...(i.snapshot?.options || []).map((x: any) => x.name),
        i.snapshot?.notes,
      ]
        .filter(Boolean)
        .join(" · "),
      quantity: Number(i.quantity),
      emoji: "",
    })),
    notes: [
      o.notes,
      o.receipt_verification === "pending"
        ? "بانتظار تأكيد استلام العميل"
        : o.receipt_verification === "disputed"
          ? "العميل أبلغ بعدم الاستلام"
          : null,
      o.issue_open ? o.issue_text : null,
    ]
      .filter(Boolean)
      .join(" · "),
    deliveryFee: Number(o.delivery_fee || 0),
    total: Number(o.total || 0),
    paymentMethod: o.payment_method === "online" ? "online" : "cash",
    paymentState: o.payment_status === "paid" ? "paid" : "due",
    paymentLabel:
      (
        {
          cash: "نقدًا",
          pay_on_delivery: "دفع عند الاستلام",
          card_at_venue: "بطاقة في المطعم",
          online: "أونلاين",
        } as Record<string, string>
      )[o.payment_method] || o.payment_method,
  };
}
const emptyDriver = {
  name: "",
  role: "سائق توصيل",
  status: "offline" as DriverStatus,
  queuePosition: null as number | null,
  queueTotal: 0,
  shiftStartedAt: "وقت بدء الوردية غير متاح",
  stats: {
    currentOrders: 0,
    deliveredToday: 0,
    avgDeliveryMinutes: null as number | null,
    distanceTodayKm: null as number | null,
  },
};
export function useDelivery() {
  const [driver, setDriver] = useState(emptyDriver),
    [orders, setOrders] = useState<DeliveryOrder[]>([]),
    [completed, setCompleted] = useState<DeliveryOrder[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const lock = useRef(false),
    alive = useRef(true),
    requestVersion = useRef(0);
  const { context, rpc } = window.cardfyDelivery;
  async function refresh() {
    const version = ++requestVersion.current;
    try {
      const snap = await rpc("cfy_os_operational_snapshot", {
        p_token: context.token,
        p_page: "delivery",
      });
      let queue = { position: null, total: 0 };
      try {
        if (window.cardfyDelivery.queueEnabled)
          queue = await rpc("cfy_os_driver_queue", { p_token: context.token });
      } catch {
        /* Optional read API is pending deployment; orders remain usable. */
      }
      if (!alive.current || version !== requestVersion.current) return;
      const all = (snap.orders || []).filter(
        (o: any) => o.order_type === "delivery",
      );
      const current = all.filter((o: any) =>
        ["ready", "on_the_way"].includes(o.status),
      );
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Africa/Cairo",
      });
      const done = all.filter(
        (o: any) =>
          ["delivered", "completed"].includes(o.status) &&
          o.delivered_at &&
          new Date(o.delivered_at).toLocaleDateString("en-CA", {
            timeZone: "Africa/Cairo",
          }) === today,
      );
      const times = done
        .filter((o: any) => o.picked_up_at)
        .map(
          (o: any) =>
            (new Date(o.delivered_at).getTime() -
              new Date(o.picked_up_at).getTime()) /
            60000,
        )
        .filter((x: number) => x >= 0);
      setOrders(current.map(mapDeliveryOrder));
      setCompleted(done.map(mapDeliveryOrder));
      setDriver({
        ...emptyDriver,
        queuePosition: queue.position,
        queueTotal: queue.total,
        name: snap.actor.name || context.name,
        role: context.role === "owner" ? "صاحب المطعم" : "سائق توصيل",
        status:
          snap.actor.shift_state === "available" &&
          current.some((o: any) => o.status === "on_the_way")
            ? "delivering"
            : snap.actor.shift_state || "offline",
        stats: {
          currentOrders: current.length,
          deliveredToday: done.length,
          avgDeliveryMinutes: times.length
            ? Math.round(
                times.reduce((a: number, b: number) => a + b, 0) / times.length,
              )
            : null,
          distanceTodayKm: null,
        },
      });
      setError("");
    } catch (e: any) {
      if (alive.current && version === requestVersion.current)
        setError(e.message || "تعذر تحديث طلباتك.");
    } finally {
      if (alive.current && version === requestVersion.current)
        setLoading(false);
    }
  }
  async function mutate(operation: () => Promise<unknown>) {
    if (lock.current) throw new Error("عملية قيد التنفيذ");
    lock.current = true;
    ++requestVersion.current;
    setBusy(true);
    try {
      await operation();
      await refresh();
    } catch (e: any) {
      toast.error(
        e.message?.includes("invalid_otp")
          ? "رمز التحقق غير صحيح"
          : e.message || "تعذر تنفيذ العملية",
      );
      throw e;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const action = (id: string, action: string, data: Record<string, unknown>) =>
    mutate(() =>
      rpc("cfy_os_order_action", {
        p_token: context.token,
        p_page: "delivery",
        p_order_id: id,
        p_action: action,
        p_data: data,
      }),
    );
  const shift = (state: string) => {
    void mutate(() =>
      rpc("cfy_menu_staff_shift", { p_token: context.token, p_state: state }),
    ).catch(() => {});
  };
  useEffect(() => {
    alive.current = true;
    refresh();
    const timer = setInterval(() => {
      if (!lock.current) refresh();
    }, 15000);
    return () => {
      alive.current = false;
      clearInterval(timer);
    };
  }, []);
  return {
    driver,
    orders,
    completed,
    loading,
    error,
    busy,
    refresh,
    action,
    shift,
  };
}
