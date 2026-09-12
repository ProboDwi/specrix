import GadgetCard from "./GadgetCard";

interface Gadget {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: { id: string; name: string; slug: string };
  priceIdr: number;
  imageUrl: string | null;
  shortDesc: string | null;
  specs: Record<string, unknown>;
}

export default function GadgetGrid({ gadgets }: { gadgets: Gadget[] }) {
  if (gadgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium">Tidak ada gadget ditemukan</p>
        <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {gadgets.map((g) => (
        <GadgetCard key={g.id} {...g} />
      ))}
    </div>
  );
}
