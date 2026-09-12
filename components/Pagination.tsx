"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function go(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  const pages: number[] = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
      >
        ‹
      </button>
      {pages[0] > 1 && (
        <>
          <button onClick={() => go(1)} className="w-9 h-9 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">1</button>
          {pages[0] > 2 && <span className="text-gray-600 px-1">…</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            p === page
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {p}
        </button>
      ))}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="text-gray-600 px-1">…</span>}
          <button onClick={() => go(totalPages)} className="w-9 h-9 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">{totalPages}</button>
        </>
      )}
      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
      >
        ›
      </button>
    </div>
  );
}
