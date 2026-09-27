import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deliveryZones } from "@/lib/pos-data";

export type CustomerInfo = {
  name: string;
  phone: string;
  zoneId: string;
  address: string;
  notes: string;
};

export const emptyCustomer: CustomerInfo = {
  name: "",
  phone: "",
  zoneId: "",
  address: "",
  notes: "",
};

export function AddressDialog({
  open,
  onOpenChange,
  value,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: CustomerInfo;
  onSave: (info: CustomerInfo) => void;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const set = (key: keyof CustomerInfo, v: string) => setDraft((d) => ({ ...d, [key]: v }));
  const valid = draft.name.trim() && draft.phone.trim() && draft.zoneId && draft.address.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-lg border-border bg-surface text-right">
        <DialogHeader className="text-right sm:text-right">
          <DialogTitle className="flex items-center gap-2 text-lg font-extrabold">
            <MapPin className="h-5 w-5 text-brand" />
            بيانات التوصيل
          </DialogTitle>
          <DialogDescription>أضف بيانات العميل والعنوان لهذا الطلب.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="اسم العميل">
            <input
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
              placeholder="أحمد محمود"
            />
          </Field>
          <Field label="رقم الهاتف">
            <input
              value={draft.phone}
              onChange={(e) => set("phone", e.target.value)}
              inputMode="tel"
              dir="ltr"
              className={`${inputCls} text-right`}
              placeholder="01000000000"
            />
          </Field>
          <Field label="المنطقة">
            <select
              value={draft.zoneId}
              onChange={(e) => set("zoneId", e.target.value)}
              className={inputCls}
            >
              <option value="">اختر المنطقة</option>
              {deliveryZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} — رسوم {z.fee} ج.م
                </option>
              ))}
            </select>
          </Field>
          <Field label="العنوان بالتفصيل">
            <input
              value={draft.address}
              onChange={(e) => set("address", e.target.value)}
              className={inputCls}
              placeholder="شارع / عمارة / دور / شقة"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="ملاحظات التوصيل (اختياري)">
              <textarea
                value={draft.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={2}
                className={`${inputCls} h-auto resize-none py-2`}
                placeholder="مثال: الجرس معطل — اتصل عند الوصول"
              />
            </Field>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-start">
          <button
            type="button"
            disabled={!valid}
            onClick={() => onSave(draft)}
            className="h-12 flex-1 rounded-xl brand-gradient text-base font-extrabold text-brand-foreground shadow-[var(--shadow-brand)] transition-opacity disabled:opacity-40"
          >
            حفظ
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-12 rounded-xl border border-border bg-surface-2 px-5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            إلغاء
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-border bg-surface-2/70 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
