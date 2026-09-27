import { useMemo, useState } from "react";
import { Flame, Plus, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import banner from "@/assets/brand-banner.jpg";
import { categories, egp, products, type Product } from "@/lib/pos-data";
import { hasRequiredSelections } from "@/lib/pos-order";

export function ProductArea({ onAdd, externalQuery="" }: { onAdd: (product: Product) => void; externalQuery?:string }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<""|"popular"|"new">("");
  const [sort, setSort] = useState<""|"asc"|"desc">("");

  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (query.trim() === "" || p.name.includes(query.trim())) &&
          (externalQuery.trim() === "" || p.name.includes(externalQuery.trim())) &&
          (quickFilter!=="popular" || p.badge?.includes("مبيع")) &&
          (quickFilter!=="new" || p.badge?.includes("جديد")),
      ).sort((a,b)=>sort==="asc"?a.price-b.price:sort==="desc"?b.price-a.price:0),
    [category, query, externalQuery, quickFilter, sort],
  );

  return (
    <section className="flex min-h-0 min-w-0 flex-col gap-3">
      <div className="relative h-28 shrink-0 overflow-hidden rounded-2xl border border-border sm:h-36">
        <img
          src={banner}
          alt="شاورما البلد"
          width={1536}
          height={512}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/20 via-background/70 to-background/95" />
        <div className="absolute inset-0 flex flex-col justify-center gap-1 px-4 sm:px-6">
          <h1 className="text-xl font-extrabold tracking-tight sm:text-3xl">
            طعم أصيل <span className="text-brand">..</span> لكل وقت
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            شاورما • وجبات • مقليات • مشروبات
          </p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2 overflow-x-auto pos-scroll pb-1">
        {categories.map((c) => {
          const active = c.id === category;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                active
                  ? "border-transparent brand-gradient text-brand-foreground shadow-[var(--shadow-brand)]"
                  : "border-border bg-surface-2/70 text-muted-foreground hover:bg-surface-3 hover:text-foreground"
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="ابحث عن منتج ..."
            className="h-11 w-full rounded-xl border border-border bg-surface-2/70 pr-10 pl-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60"
          />
        </div>
        <Chip icon={<Flame className="h-4 w-4 text-brand" />} label="الأكثر مبيعاً" active={quickFilter==="popular"} onClick={()=>setQuickFilter(value=>value==="popular"?"":"popular")} />
        <Chip icon={<Sparkles className="h-4 w-4 text-brand" />} label="جديد" active={quickFilter==="new"} onClick={()=>setQuickFilter(value=>value==="new"?"":"new")} />
        <Chip icon={<SlidersHorizontal className="h-4 w-4" />} label="تصفية" active={Boolean(sort)} onClick={()=>setSort(value=>value===""?"asc":value==="asc"?"desc":"")} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pos-scroll pl-1">
        <div className="grid grid-cols-2 gap-3 pb-2 sm:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onAdd(p)}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card text-right transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[var(--shadow-brand)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {p.badge && (
                  <span className="absolute right-2 top-2 rounded-lg brand-gradient px-2 py-0.5 text-[11px] font-bold text-brand-foreground">
                    {p.badge}
                  </span>
                )}
                {hasRequiredSelections(p) && (
                  <span className="absolute left-2 top-2 rounded-md border border-brand/50 bg-surface/80 px-1.5 py-0.5 text-[10px] font-bold text-brand backdrop-blur-xl">
                    اختيار مطلوب
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-bold leading-snug">{p.name}</p>
                  <p className="mt-1 text-sm font-extrabold text-brand" dir="ltr">
                    {egp(p.price)}
                  </p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl brand-gradient text-brand-foreground">
                  <Plus className="h-5 w-5" />
                </span>
              </div>
            </button>
          ))}
        </div>
        {visible.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">لا توجد منتجات مطابقة</p>
        )}
      </div>
    </section>
  );
}

function Chip({ icon, label, onClick, active }: { icon: React.ReactNode; label: string; onClick:()=>void; active:boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-border bg-surface-2/70 px-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
    >
      {icon}
      {label}
    </button>
  );
}
