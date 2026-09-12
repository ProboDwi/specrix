"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import CompareTable from "@/components/CompareTable";
import Link from "next/link";

interface Gadget {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: { name: string };
  priceIdr: number;
  imageUrl: string | null;
  specs: Record<string, unknown>;
}

function CompareContent() {
  const searchParams = useSearchParams();
  const slugsParam = searchParams.get("slugs") ?? "";
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugsParam) { setGadgets([]); return; }
    setLoading(true);
    setError(null);
    fetch(`/api/compare?slugs=${slugsParam}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setGadgets(data);
        else setError("Gagal memuat data perbandingan.");
      })
      .catch(() => setError("Terjadi kesalahan saat memuat data."))
      .finally(() => setLoading(false));
  }, [slugsParam]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-300 text-sm">
        {error}
      </div>
    );
  }

  if (gadgets.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-white mb-2">Belum ada gadget dipilih</h2>
        <p className="text-gray-400 mb-6">
          Klik &quot;+ Bandingkan&quot; pada kartu gadget untuk menambahkan ke perbandingan.
        </p>
        <Link
          href="/gadgets"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          Jelajahi Gadget
        </Link>
      </div>
    );
  }

  if (gadgets.length === 1) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        Tambahkan minimal 1 gadget lagi untuk mulai membandingkan.
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <CompareTable gadgets={gadgets} />
      </div>
      <p className="text-xs text-gray-600 mt-4 text-center">
        💡 Nilai yang lebih baik (RAM, storage, baterai) ditandai dengan warna hijau.
        Harga termurah ditandai dengan 💰.
      </p>
    </>
  );
}

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Perbandingan Gadget</h1>
        <p className="text-gray-400 text-sm">
          Bandingkan 2–3 gadget secara berdampingan. Tambahkan gadget dari halaman listing atau detail.
        </p>
      </div>
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <CompareContent />
      </Suspense>
    </div>
  );
}
