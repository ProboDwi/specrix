export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import GadgetGrid from "@/components/GadgetGrid";
import FilterSidebar from "@/components/FilterSidebar";
import SearchBar from "@/components/SearchBar";
import SortSelect from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semua Gadget",
  description:
    "Temukan HP dan laptop sesuai budget kamu. Filter berdasarkan harga, brand, dan kategori.",
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    q?: string;
    min_price?: string;
    max_price?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function GadgetsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const category =
    sp.category?.toUpperCase() === "HP" || sp.category?.toUpperCase() === "LAPTOP"
      ? (sp.category.toUpperCase() as "HP" | "LAPTOP")
      : undefined;
  const brand = sp.brand;
  const q = sp.q;
  const minPrice = sp.min_price;
  const maxPrice = sp.max_price;
  const sort = sp.sort ?? "name_asc";
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isActive: true };
  if (category) where.category = category;
  if (brand) where.brand = { slug: brand };
  if (minPrice || maxPrice) {
    where.priceIdr = {
      ...(minPrice ? { gte: parseInt(minPrice) } : {}),
      ...(maxPrice ? { lte: parseInt(maxPrice) } : {}),
    };
  }
  if (q) where.name = { contains: q, mode: "insensitive" };

  const orderBy = (() => {
    switch (sort) {
      case "price_asc":  return { priceIdr: "asc" as const };
      case "price_desc": return { priceIdr: "desc" as const };
      case "name_desc":  return { name: "desc" as const };
      default:           return { name: "asc" as const };
    }
  })();

  const [gadgets, total, brands] = await Promise.all([
    prisma.gadget.findMany({
      where, orderBy, skip, take: limit,
      include: { brand: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.gadget.count({ where }),
    prisma.brand.findMany({
      where: { gadgets: { some: { isActive: true } } },
      orderBy: { name: "asc" },
      include: { _count: { select: { gadgets: { where: { isActive: true } } } } },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          {category === "HP"
            ? "📱 Smartphone"
            : category === "LAPTOP"
            ? "💻 Laptop"
            : "Semua Gadget"}
        </h1>
        <p className="text-gray-400 text-sm">{total} gadget ditemukan</p>
      </div>

      <div className="flex gap-8">
        {/* Filter sidebar — Suspense required for useSearchParams inside */}
        <div className="hidden lg:block w-56 shrink-0">
          <Suspense fallback={<div className="space-y-3 animate-pulse"><div className="h-4 bg-gray-800 rounded w-3/4" /><div className="h-4 bg-gray-800 rounded w-1/2" /></div>}>
            <FilterSidebar
              brands={brands}
              currentCategory={category ?? ""}
              currentBrand={brand ?? ""}
              currentMinPrice={minPrice ?? ""}
              currentMaxPrice={maxPrice ?? ""}
            />
          </Suspense>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <Suspense fallback={<div className="h-10 bg-gray-800 rounded-xl animate-pulse" />}>
                <SearchBar defaultValue={q ?? ""} />
              </Suspense>
            </div>
            <Suspense fallback={<div className="h-10 w-40 bg-gray-800 rounded-xl animate-pulse" />}>
              <SortSelect value={sort} />
            </Suspense>
          </div>

          <GadgetGrid
            gadgets={gadgets.map((g) => ({
              ...g,
              specs: g.specs as Record<string, unknown>,
            }))}
          />

          <Suspense fallback={null}>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
