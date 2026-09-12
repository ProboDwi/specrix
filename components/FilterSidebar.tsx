"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface Brand {
  id: string;
  name: string;
  slug: string;
  _count: { gadgets: number };
}

interface FilterSidebarProps {
  brands: Brand[];
  currentCategory?: string;
  currentBrand?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

const CATEGORIES = [
  { value: "", label: "Semua Kategori" },
  { value: "HP", label: "📱 Smartphone" },
  { value: "LAPTOP", label: "💻 Laptop" },
];

const PRICE_RANGES = [
  { label: "Semua Harga", min: "", max: "" },
  { label: "Di bawah Rp 2 Juta", min: "", max: "2000000" },
  { label: "Rp 2 – 5 Juta", min: "2000000", max: "5000000" },
  { label: "Rp 5 – 10 Juta", min: "5000000", max: "10000000" },
  { label: "Rp 10 – 20 Juta", min: "10000000", max: "20000000" },
  { label: "Di atas Rp 20 Juta", min: "20000000", max: "" },
];

export default function FilterSidebar({
  brands,
  currentCategory = "",
  currentBrand = "",
  currentMinPrice = "",
  currentMaxPrice = "",
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const push = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
        else params.delete(k);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <aside className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Kategori
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => push({ category: c.value })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                currentCategory === c.value
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Rentang Harga
        </h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => {
            const active = currentMinPrice === r.min && currentMaxPrice === r.max;
            return (
              <button
                key={r.label}
                onClick={() => push({ min_price: r.min, max_price: r.max })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Brand
        </h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          <button
            onClick={() => push({ brand: "" })}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !currentBrand
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            Semua Brand
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => push({ brand: b.slug })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors ${
                currentBrand === b.slug
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span>{b.name}</span>
              <span className="text-xs opacity-60">{b._count.gadgets}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
