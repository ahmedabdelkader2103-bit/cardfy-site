export type DriverStatus = "available" | "delivering" | "paused" | "offline";

export type OrderStatus = "assigned" | "on_the_way" | "out_for_delivery" | "delivered";

export type PaymentMethod = "online" | "cash";

export type PaymentState = "paid" | "due";

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  emoji: string;
};

export type DeliveryOrder = {
  id: string;
  code: string;
  time: string;
  status: OrderStatus;
  customerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  mapsUrl: string;
  distanceKm: number | null;
  items: OrderItem[];
  notes?: string;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentState: PaymentState;
  paymentLabel: string;
  closed: boolean;
};

export type FallbackReason =
  | "customer_lost_otp"
  | "another_person"
  | "cannot_access_otp"
  | "other";

