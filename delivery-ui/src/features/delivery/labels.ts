import type { DriverStatus, FallbackReason, OrderStatus } from "./types";

export const driverStatusLabel: Record<DriverStatus, string> = {
  available: "متاح",
  delivering: "قيد التوصيل",
  paused: "إيقاف مؤقت",
  offline: "انتهت الوردية",
};

export const orderStatusLabel: Record<OrderStatus, string> = {
  assigned: "بانتظار التوصيل",
  on_the_way: "في الطريق",
  out_for_delivery: "قيد التوصيل",
  delivered: "تم التسليم",
};

export const fallbackReasons: { value: FallbackReason; label: string }[] = [
  { value: "customer_lost_otp", label: "العميل فقد رمز OTP" },
  { value: "another_person", label: "شخص آخر يستلم الطلب" },
  { value: "cannot_access_otp", label: "العميل لا يستطيع الوصول إلى الرمز" },
  { value: "other", label: "سبب آخر" },
];

export const egp = (value: number) => `EGP ${value.toLocaleString("en-US")}`;

