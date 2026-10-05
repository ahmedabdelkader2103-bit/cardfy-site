import { Check } from "lucide-react";
import { modifierGroups } from "@/lib/pos-data";
import { egp } from "@/lib/pos-data";
import { getProduct, type OrderLine } from "@/lib/pos-order";

export function ModifierPanel({
  line,
  onToggle,
}: {
  line: OrderLine;
  onToggle: (groupId: string, optionId: string) => void;
}) {
  const product = getProduct(line.productId);
  const groups = product.groups.flatMap((g) => {
    const group = modifierGroups[g];
    return group ? [group] : [];
  });

  return (
    <div className="rounded-2xl border border-brand/30 bg-surface-2/50 p-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={816}
            height={816}
            className="h-10 w-10 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{product.name}</p>
            <p className="text-xs font-bold text-brand" dir="ltr">
              {egp(product.price)}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-muted-foreground">خيارات وإضافات المنتج</span>
      </div>

      {groups.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">
          لا توجد إضافات متاحة لهذا المنتج
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.id} className="rounded-xl border border-border bg-surface/60 p-2">
              <div className="flex items-center justify-between gap-2 pb-2">
                <p className="truncate text-xs font-bold">{group.name}</p>
                <span
                  className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    group.required
                      ? "bg-brand/15 text-brand"
                      : "bg-surface-3 text-muted-foreground"
                  }`}
                >
                  {group.required ? "مطلوب" : "اختياري"}
                </span>
              </div>
              <div className="space-y-1.5">
                {group.options.map((option) => {
                  const active = (line.selections[group.id] ?? []).includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onToggle(group.id, option.id)}
                      className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border px-2.5 py-2 text-right transition-colors ${
                        active
                          ? "border-brand bg-brand/15"
                          : "border-border bg-surface-2/60 hover:bg-surface-3"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-bold">{option.name}</span>
                        <span
                          className={`block text-[11px] ${active ? "text-brand" : "text-muted-foreground"}`}
                          dir="ltr"
                        >
                          {option.price > 0 ? `+${option.price}.00` : "+0.00"}
                        </span>
                      </span>
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center border ${
                          group.multi ? "rounded-md" : "rounded-full"
                        } ${active ? "border-brand bg-brand text-brand-foreground" : "border-border"}`}
                      >
                        {active && <Check className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
