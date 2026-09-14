import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fallbackReasons } from "../labels";
import type { FallbackReason } from "../types";

export function FallbackDialog({
  open,
  orderCode,
  onOpenChange,
  onConfirm, busy = false,
}: {
  open: boolean;
  orderCode?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: FallbackReason, note: string) => Promise<unknown>;
  busy?: boolean;
}) {
  const [reason, setReason] = useState<FallbackReason>("customer_lost_otp");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => { if (open) { setConfirmed(false); setError(""); setNote(""); setReason("customer_lost_otp"); } }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md text-start">
        <DialogHeader className="text-start">
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            تعذر الوصول إلى OTP
          </DialogTitle>
          <DialogDescription>
            اختر سبب إتمام التسليم بدون رمز التحقق. سيتم تسجيل السبب مع الطلب {orderCode}.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={reason}
          onValueChange={(v) => setReason(v as FallbackReason)}
          className="gap-2"
        >
          {fallbackReasons.map((item) => (
            <Label
              key={item.value}
              htmlFor={item.value}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 text-sm font-medium has-[:checked]:border-primary/50 has-[:checked]:bg-primary/10"
            >
              <RadioGroupItem id={item.value} value={item.value} />
              {item.label}
            </Label>
          ))}
        </RadioGroup>

        {reason === "other" && (
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="اكتب السبب..."
            className="min-h-20"
          />
        )}

        <p className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs leading-relaxed text-warning">
          سيتم إرسال تأكيد للعميل للتحقق من استلام الطلب.
        </p>

        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />سلمت الطلب للعميل وأؤكد تسجيل الاستثناء.</label>
        {error && <p role="alert" className="text-destructive">{error}</p>}
        <DialogFooter className="gap-2 sm:justify-start">
          <Button
            className="h-11 flex-1"
            disabled={busy || !confirmed || (reason === "other" && note.trim().length < 5)}
            onClick={async () => { try { await onConfirm(reason, note); setNote(""); setConfirmed(false); setError(""); } catch { setError("تعذر تسجيل الاستثناء. حاول مجددًا."); } }}
          >
            إتمام التسليم استثنائياً
          </Button>
          <Button variant="secondary" className="h-11" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

