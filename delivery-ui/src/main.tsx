import React from "react";
import { createRoot } from "react-dom/client";
import DeliveryPage from "./DeliveryPage";
import "./styles.css";
export function mountDelivery(host: HTMLElement, boundary: unknown) {
  window.cardfyDelivery = boundary as DeliveryBoundary;
  const root = createRoot(host);
  root.render(<DeliveryPage />);
  window.addEventListener("pagehide", () => root.unmount(), { once: true });
}
export type DeliveryBoundary = {
  queueEnabled?: boolean;
  context: Record<string, any>;
  rpc: (name: string, args: Record<string, unknown>) => Promise<any>;
};
declare global {
  interface Window {
    cardfyDelivery: DeliveryBoundary;
  }
}
