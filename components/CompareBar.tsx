"use client";
import Link from "next/link";
import { useCompare } from "@/hooks/useCompare";

export default function CompareBar() {
  const { items, remove, clear } = useCompare();

  if (items.length === 0) return null;

  const slugs = items.map((i) => i.slug).join(",");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-indigo-500/50 shadow-2xl shadow-indigo-500/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-medium shrink-0">
            Bandingkan ({items.length}/3):
          </span>
          {items.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-1.5 bg-gray-800 text-white text-xs px-2.5 py-1 rounded-full"
            >
              {item.name}
              <button
                onClick={() => remove(item.id)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={`Hapus ${item.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clear}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Hapus semua
          </button>
          {items.length >= 2 && (
            <Link
              href={`/compare?slugs=${slugs}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Bandingkan →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
