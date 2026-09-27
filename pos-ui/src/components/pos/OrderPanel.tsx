import { Bike, Check, MapPin, Minus, Plus, Save, ShoppingBag, Trash2 } from "lucide-react";
import { egp } from "@/lib/pos-data";
import { getProduct, lineTotal, selectionLabels, type OrderLine } from "@/lib/pos-order";
import { ModifierPanel } from "./ModifierPanel";

export type OrderType = "delivery" | "pickup";

export function OrderPanel({
  orderType,
  onOrderTypeChange,
  lines,
  selectedLine,
  onSelectLine,
  onQuantity,
  onRemove,
  onClearAll,
  onToggleModifier,
  onCloseModifiers,
  notes,
  onNotesChange,
  subtotal,
  deliveryFee,
  zoneName,
  hasAddress,
  onOpenAddress,
  onSaveOrder,
  onComplete,
  deliveryEnabled,
}: {
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  lines: OrderLine[];
  selectedLine: OrderLine | null;
  onSelectLine: (id: string) => void;
  onQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onToggleModifier: (groupId: string, optionId: string) => void;
  onCloseModifiers: () => void;
  notes: string;
  onNotesChange: (value: string) => void;
  subtotal: number;
  deliveryFee: number;
  zoneName: string | null;
  hasAddress: boolean;
  onOpenAddress: () => void;
  onSaveOrder: () => void;
  onComplete: () => void;
  deliveryEnabled: boolean;
}) {
  const isDelivery = orderType === "delivery";
  const total = subtotal + (isDelivery ? deliveryFee : 0);
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);

  return (
    <aside className="flex min-h-0 min-w-0 flex-col gap-3">
      {/* Order type */}
      <div className="panel shrink-0 p-2">
        <p className="px-1 pb-2 pt-1 text-xs font-bold text-muted-foreground">نوع الطلب</p>
        <div className="grid grid-cols-2 gap-2">
          <TypeButton
            active={isDelivery}
            onClick={() => onOrderTypeChange("delivery")}
            disabled={!deliveryEnabled}
            icon={<Bike className="h-5 w-5" />}
            label="توصيل"
          />
          <TypeButton
            active={!isDelivery}
            onClick={() => onOrderTypeChange("pickup")}
            icon={<ShoppingBag className="h-5 w-5" />}
            label="استلام من المطعم"
          />
        </div>
      </div>

      {/* Current order + modifiers */}
      <div className="panel flex min-h-0 flex-1 flex-col p-3">
        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 pb-3">
          <h2 className="truncate text-base font-extrabold">
            الطلب الحالي
            {itemCount > 0 && <span className="text-muted-foreground"> ({itemCount})</span>}
          </h2>
          <button
            type="button"
            onClick={onClearAll}
            disabled={lines.length === 0}
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            حذف الكل
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pos-scroll lg:min-h-[6rem]">
          {lines.length === 0 && (
            <div className="grid h-full min-h-28 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
              أضف منتجات لبدء الطلب
            </div>
          )}
          {lines.map((line) => {
            const product = getProduct(line.productId);
            const labels = selectionLabels(line);
            const active = selectedLine?.id === line.id;
            return (
              <div
                key={line.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectLine(line.id)}
                onKeyDown={(e) => e.key === "Enter" && onSelectLine(line.id)}
                className={`grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border p-2 transition-colors ${
                  active ? "border-brand bg-brand/10" : "border-border bg-surface-2/50 hover:bg-surface-3/60"
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{product.name}</p>
                  {labels.length > 0 && (
                    <p className="truncate text-[11px] text-muted-foreground">
                      {labels.join(" • ")}
                    </p>
                  )}
                  <p className="mt-0.5 text-sm font-extrabold text-brand" dir="ltr">
                    {egp(lineTotal(line))}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
                    <button
                      type="button"
                      aria-label="زيادة الكمية"
                      onClick={() => onQuantity(line.id, 1)}
                      className="grid h-7 w-7 place-items-center rounded-md bg-surface-3 transition-colors hover:bg-brand hover:text-brand-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-extrabold">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label="تقليل الكمية"
                      onClick={() => onQuantity(line.id, -1)}
                      className="grid h-7 w-7 place-items-center rounded-md bg-surface-3 transition-colors hover:bg-brand hover:text-brand-foreground"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label="حذف المنتج"
                    onClick={() => onRemove(line.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="min-h-0 shrink space-y-3 overflow-y-auto pos-scroll pt-3">
          <input
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="ملاحظات على الطلب ..."
            className="h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60"
          />

          {selectedLine && (
            <div className="max-h-none overflow-y-auto pos-scroll">
              <ModifierPanel
                line={selectedLine}
                onToggle={onToggleModifier}
                onClose={onCloseModifiers}
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary + actions */}
      <div className="panel shrink-0 p-3">
        <div className="space-y-1.5 text-sm">
          <Row label="المجموع الفرعي" value={egp(subtotal)} />
          {isDelivery && (
            <Row
              label={zoneName ? `رسوم التوصيل — ${zoneName}` : "رسوم التوصيل"}
              value={egp(deliveryFee)}
            />
          )}
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2">
            <span className="text-sm font-extrabold">الإجمالي</span>
            <span className="text-xl font-extrabold text-brand" dir="ltr">
              {egp(total)}
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={onComplete}
            disabled={lines.length === 0}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl brand-gradient px-4 text-lg font-extrabold text-brand-foreground shadow-[var(--shadow-brand)] transition-transform hover:scale-[1.01] disabled:opacity-40"
          >
            <Check className="h-5 w-5 shrink-0" />
            إتمام الطلب
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSaveOrder}
              disabled={lines.length === 0}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <Save className="h-4 w-4 shrink-0" />
              <span className="truncate">حفظ الطلب</span>
            </button>
            {isDelivery && (
              <button
                type="button"
                onClick={onOpenAddress}
                className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition-colors ${
                  hasAddress
                    ? "border-brand/50 bg-brand/10 text-brand"
                    : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"
                }`}
              >
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{hasAddress ? "تعديل العنوان" : "إضافة العنوان"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold" dir="ltr">
        {value}
      </span>
    </div>
  );
}

function TypeButton({
  active,
  onClick,
  icon,
  label,
  disabled=false,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-14 items-center justify-center gap-2 rounded-xl border text-sm font-extrabold transition-all ${
        active
          ? "border-transparent brand-gradient text-brand-foreground shadow-[var(--shadow-brand)]"
          : "border-border bg-surface-2/70 text-muted-foreground hover:bg-surface-3 hover:text-foreground"
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
