import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
export function IssueDialog({
  open,
  orderCode,
  busy,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  orderCode?: string;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (text: string) => Promise<unknown>;
}) {
  const [text, setText] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    if (open) {
      setText("");
      setError("");
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md text-start">
        <DialogHeader className="text-start">
          <DialogTitle>تسجيل مشكلة</DialogTitle>
          <DialogDescription>
            وصف المشكلة في الطلب {orderCode}
          </DialogDescription>
        </DialogHeader>
        <Textarea
          aria-label="وصف المشكلة"
          value={text}
          maxLength={1000}
          disabled={busy}
          onChange={(e) => setText(e.target.value)}
        />
        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button
            disabled={busy || !text.trim()}
            onClick={async () => {
              try {
                await onConfirm(text.trim());
              } catch {
                setError("تعذر تسجيل المشكلة. حاول مجددًا.");
              }
            }}
          >
            تسجيل المشكلة
          </Button>
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
