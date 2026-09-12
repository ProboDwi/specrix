"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const SORT_OPTIONS = [
  { value: "name_asc", label: "Nama A–Z" },
  { value: "name_desc", label: "Nama Z–A" },
  { value: "price_asc", label: "Harga Termurah" },
  { value: "price_desc", label: "Harga Termahal" },
];

export default function SortSelect({ value: current = "name_asc" }: { value?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
