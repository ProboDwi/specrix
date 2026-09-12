export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import SpecsTable from "@/components/SpecsTable";
import PriceTag from "@/components/PriceTag";
import CompareButton from "@/components/CompareButton";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(props: PageProps<"/gadgets/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const gadget = await prisma.gadget.findUnique({
    where: { slug, isActive: true },
    include: { brand: { select: { name: true } } },
  });
  if (!gadget) return { title: "Gadget tidak ditemukan" };
  return {
    title: gadget.name,
    description: gadget.shortDesc ?? `Spesifikasi lengkap ${gadget.name} dari ${gadget.brand.name}`,
  };
}

export default async function GadgetDetailPage(props: PageProps<"/gadgets/[slug]">) {
  const { slug } = await props.params;

  const gadget = await prisma.gadget.findUnique({
    where: { slug, isActive: true },
    include: { brand: { select: { id: true, name: true, slug: true } } },
  });

  if (!gadget) notFound();

  // Related gadgets (same category, same brand, different slug)
  const related = await prisma.gadget.findMany({
    where: {
      category: gadget.category,
      isActive: true,
      slug: { not: gadget.slug },
      brandId: gadget.brandId,
    },
    take: 3,
    orderBy: { priceIdr: "asc" },
    include: { brand: { select: { id: true, name: true, slug: true } } },
  });

  const specs = gadget.specs as Record<string, unknown>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
        <span>/</span>
        <Link href="/gadgets" className="hover:text-white transition-colors">Gadget</Link>
        <span>/</span>
        <Link href={`/gadgets?category=${gadget.category}`} className="hover:text-white transition-colors">
          {gadget.category === "HP" ? "Smartphone" : "Laptop"}
        </Link>
        <span>/</span>
        <span className="text-gray-300 truncate max-w-xs">{gadget.name}</span>
      </nav>

      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Image */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 aspect-square relative overflow-hidden flex items-center justify-center p-8">
          {gadget.imageUrl ? (
            <Image
              src={gadget.imageUrl}
              alt={gadget.name}
              fill
              className="object-contain p-8"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="text-gray-700 text-6xl">📱</div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                gadget.category === "HP"
                  ? "bg-emerald-900/80 text-emerald-300"
                  : "bg-blue-900/80 text-blue-300"
              }`}>
                {gadget.category === "HP" ? "Smartphone" : "Laptop"}
              </span>
              <Link
                href={`/gadgets?brand=${gadget.brand.slug}`}
                className="text-xs text-gray-400 hover:text-indigo-400 transition-colors"
              >
                {gadget.brand.name}
              </Link>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
              {gadget.name}
            </h1>
            {gadget.shortDesc && (
              <p className="text-gray-400 mb-4 leading-relaxed">{gadget.shortDesc}</p>
            )}
            <PriceTag price={gadget.priceIdr} className="text-3xl" />
            <p className="text-xs text-gray-600 mt-1">Harga dapat berubah sewaktu-waktu</p>
          </div>

          <div className="mt-6 space-y-3">
            <CompareButton
              gadgetId={gadget.id}
              gadgetName={gadget.name}
              gadgetSlug={gadget.slug}
            />
            {gadget.sourceUrl && (
              <a
                href={gadget.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-xs text-gray-500 hover:text-gray-300 transition-colors py-1"
              >
                Lihat sumber data ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Specs table */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">Spesifikasi Lengkap</h2>
        <SpecsTable specs={specs} category={gadget.category} />
        {gadget.lastVerifiedDate && (
          <p className="text-xs text-gray-600 mt-2 text-right">
            Data diverifikasi: {new Date(gadget.lastVerifiedDate).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white mb-4">
            Produk {gadget.brand.name} Lainnya
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/gadgets/${r.slug}`}
                className="bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl p-4 transition-all group"
              >
                <p className="font-medium text-white text-sm group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
                  {r.name}
                </p>
                <PriceTag price={r.priceIdr} short className="text-sm" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
