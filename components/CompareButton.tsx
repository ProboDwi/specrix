"use client";
import { useCompare } from "@/hooks/useCompare";

interface CompareButtonProps {
  gadgetId: string;
  gadgetName: string;
  gadgetSlug: string;
}

export default function CompareButton({ gadgetId, gadgetName, gadgetSlug }: CompareButtonProps) {
  const { items, add, remove, has } = useCompare();
  const selected = has(gadgetId);
  const full = items.length >= 3 && !selected;

  return (
    <button
      onClick={() =>
        selected
          ? remove(gadgetId)
          : add({ id: gadgetId, name: gadgetName, slug: gadgetSlug })
      }
      disabled={full}
      className={`w-full text-xs py-1.5 rounded-lg border transition-all ${
        selected
          ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700"
          : full
          ? "bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed"
          : "bg-transparent border-gray-700 text-gray-400 hover:border-indigo-500 hover:text-indigo-400"
      }`}
    >
      {selected ? "✓ Ditambahkan" : full ? "Maks 3 gadget" : "+ Bandingkan"}
    </button>
  );
}
