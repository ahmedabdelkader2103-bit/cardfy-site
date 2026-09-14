import { useRef, useState } from "react";
import { AlertTriangle, Check, Info, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OtpPanel({
  onConfirm,
  onFallback, busy = false,
}: {
  onConfirm: (code: string) => Promise<unknown>;
  onFallback: () => void;
  busy?: boolean;
}) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    setError(null);
    if (clean && index < 5) refs.current[index + 1]?.focus();
  };

  const handleConfirm = async () => {
    const code = digits.join("");
    if (code.length !== 6) {
      setError("من فضلك أدخل رمز التحقق المكون من 6 أرقام.");
      return;
    }
    try { await onConfirm(code); setDigits(Array(6).fill("")); } catch { setError("تعذر تأكيد التسليم. تحقق من الرمز وحاول مجددًا."); }
  };

  return (
    <div className="rounded-2xl border border-primary/40 bg-primary/5 p-3 sm:p-4">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-primary">
            <ShieldCheck className="size-4" />
            رمزُ التحقق عند التسليم
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            اطلب من العميل رمز التحقق المكون من 6 أرقام لإتمام التسليم.
          </p>
          <div dir="ltr" className="mt-3 flex gap-2">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  refs.current[index] = el;
                }}
                value={digit}
                onChange={(e) => setDigit(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digits[index] && index > 0) {
                    refs.current[index - 1]?.focus();
                  }
                }}
                onPaste={(e) => { const clean=e.clipboardData.getData("text").replace(/\D/g, "").slice(0,6); if(clean.length>1){e.preventDefault();setDigits(Array.from({length:6},(_,i)=>clean[i]||""));setError(null);refs.current[Math.min(clean.length,6)-1]?.focus();} }}
                disabled={busy}
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-label={`رقم ${index + 1} من رمز التحقق`}
                className={cn(
                  "h-14 w-full max-w-16 rounded-xl border bg-card text-center text-2xl font-extrabold outline-none transition-colors",
                  error ? "border-destructive" : "border-border focus:border-primary",
                )}
              />
            ))}
          </div>
          {error && <p className="mt-2 text-xs font-semibold text-destructive">{error}</p>}
        </div>

        <div className="flex flex-col justify-center gap-2">
          <Button className="h-12 text-base font-bold" disabled={busy} onClick={handleConfirm}>
            <Check className="size-5" />
            تأكيد التسليم
          </Button>
          <Button variant="danger_outline" className="h-11" disabled={busy} onClick={onFallback}>
            <AlertTriangle className="size-4" />
            تعذر الوصول إلى OTP
          </Button>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p>
            في حال استخدام خيار تعذر الوصول إلى OTP سيتم إرسال إشعار للعميل داخل التطبيق للتأكيد على
            استلام الطلب.
          </p>
        </div>
      </div>
    </div>
  );
}

