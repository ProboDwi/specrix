export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import GadgetCard from "@/components/GadgetCard";

export default async function HomePage() {
  const [featuredHp, featuredLaptop, totalCount] = await Promise.all([
    prisma.gadget.findMany({
      where: { category: "HP", isActive: true },
      orderBy: { priceIdr: "asc" },
      take: 4,
      include: { brand: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.gadget.findMany({
      where: { category: "LAPTOP", isActive: true },
      orderBy: { priceIdr: "asc" },
      take: 4,
      include: { brand: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.gadget.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          ⚡ {totalCount}+ Gadget Tersedia
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Temukan Gadget{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Sesuai Budget
          </span>
          <br />Kamu
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Bandingkan spesifikasi HP &amp; laptop secara berdampingan. Data akurat,
          mudah dipahami, cocok untuk semua budget.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/gadgets"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors text-base"
          >
            Jelajahi Semua Gadget
          </Link>
          <Link
            href="/compare"
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors text-base"
          >
            Bandingkan Gadget
          </Link>
        </div>
      </section>

      {/* Category cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        <Link
          href="/gadgets?category=HP"
          className="group relative bg-gradient-to-br from-emerald-900/40 to-gray-900 border border-emerald-800/40 hover:border-emerald-500/50 rounded-2xl p-6 transition-all"
        >
          <div className="text-4xl mb-3">📱</div>
          <h2 className="text-xl font-bold text-white mb-1">Smartphone</h2>
          <p className="text-sm text-gray-400">Android &amp; iOS — dari entry hingga flagship</p>
          <span className="absolute top-4 right-4 text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
        <Link
          href="/gadgets?category=LAPTOP"
          className="group relative bg-gradient-to-br from-blue-900/40 to-gray-900 border border-blue-800/40 hover:border-blue-500/50 rounded-2xl p-6 transition-all"
        >
          <div className="text-4xl mb-3">💻</div>
          <h2 className="text-xl font-bold text-white mb-1">Laptop</h2>
          <p className="text-sm text-gray-400">Produktivitas, gaming, hingga ultrabook tipis</p>
          <span className="absolute top-4 right-4 text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </section>

      {/* Featured Smartphones */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">📱 Smartphone Terjangkau</h2>
          <Link href="/gadgets?category=HP&sort=price_asc" className="text-sm text-indigo-400 hover:text-indigo-300">
            Lihat semua →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredHp.map((g) => (
            <GadgetCard key={g.id} {...g} specs={g.specs as Record<string, unknown>} />
          ))}
        </div>
      </section>

      {/* Featured Laptops */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">💻 Laptop Terjangkau</h2>
          <Link href="/gadgets?category=LAPTOP&sort=price_asc" className="text-sm text-indigo-400 hover:text-indigo-300">
            Lihat semua →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredLaptop.map((g) => (
            <GadgetCard key={g.id} {...g} specs={g.specs as Record<string, unknown>} />
          ))}
        </div>
      </section>

      {/* Compare CTA */}
      <section className="bg-gradient-to-br from-indigo-900/30 to-violet-900/20 border border-indigo-500/20 rounded-3xl p-8 md:p-12 text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Bingung pilih yang mana?</h2>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Gunakan fitur Compare untuk membandingkan 2–3 gadget secara berdampingan.
          Klik &quot;+ Bandingkan&quot; di kartu gadget mana saja untuk memulai.
        </p>
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Mulai Bandingkan
        </Link>
      </section>
    </div>
  );
}
