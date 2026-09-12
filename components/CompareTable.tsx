import { formatPriceShort } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CompareGadget {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: { name: string };
  priceIdr: number;
  imageUrl: string | null;
  specs: Record<string, unknown>;
}

const HP_ROWS: { key: string; label: string }[] = [
  { key: "chipset", label: "Chipset" },
  { key: "ram", label: "RAM" },
  { key: "storage", label: "Penyimpanan" },
  { key: "display.size", label: "Ukuran Layar" },
  { key: "display.type", label: "Tipe Layar" },
  { key: "display.refreshRate", label: "Refresh Rate" },
  { key: "rearCamera", label: "Kamera Belakang" },
  { key: "frontCamera", label: "Kamera Depan" },
  { key: "battery.capacity", label: "Baterai" },
  { key: "battery.charging", label: "Pengisian" },
  { key: "os", label: "OS" },
  { key: "connectivity", label: "Konektivitas" },
  { key: "weight", label: "Berat" },
  { key: "waterResistance", label: "Water Resistance" },
  { key: "fingerprint", label: "Sidik Jari" },
];

const LAPTOP_ROWS: { key: string; label: string }[] = [
  { key: "cpu", label: "Prosesor" },
  { key: "gpu", label: "Kartu Grafis" },
  { key: "ram", label: "RAM" },
  { key: "storage", label: "Penyimpanan" },
  { key: "display.size", label: "Ukuran Layar" },
  { key: "display.type", label: "Tipe Layar" },
  { key: "display.refreshRate", label: "Refresh Rate" },
  { key: "battery.capacity", label: "Baterai" },
  { key: "battery.charging", label: "Pengisian" },
  { key: "os", label: "OS" },
  { key: "ports", label: "Port" },
  { key: "connectivity", label: "Konektivitas" },
  { key: "weight", label: "Berat" },
];

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined) return "-";
    cur = (cur as Record<string, unknown>)[p];
  }
  if (cur === null || cur === undefined) return "-";
  if (typeof cur === "boolean") return cur ? "Ya" : "Tidak";
  return String(cur);
}

function isBetter(key: string, values: string[]): boolean[] {
  // For price (lower is better) — handled externally
  // For RAM/storage/battery numerics — higher is better
  const numericHigher = ["ram", "storage", "battery.capacity", "display.refreshRate"];
  if (!numericHigher.some((k) => key.includes(k))) return values.map(() => false);

  const nums = values.map((v) => parseFloat(v.replace(/[^0-9.]/g, "")));
  const max = Math.max(...nums.filter((n) => !isNaN(n)));
  return nums.map((n) => !isNaN(n) && n === max && nums.filter((x) => x === max).length < nums.length);
}

export default function CompareTable({ gadgets }: { gadgets: CompareGadget[] }) {
  if (gadgets.length === 0) return null;

  const allHp = gadgets.every((g) => g.category === "HP");
  const rows = allHp ? HP_ROWS : LAPTOP_ROWS;

  const priceNums = gadgets.map((g) => g.priceIdr);
  const minPrice = Math.min(...priceNums);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left p-4 text-gray-400 font-medium bg-gray-900 rounded-tl-xl w-40">Spesifikasi</th>
            {gadgets.map((g) => (
              <th key={g.id} className="p-4 bg-gray-900 text-center min-w-[180px]">
                <div className="flex flex-col items-center gap-2">
                  {g.imageUrl && (
                    <div className="relative w-20 h-20">
                      <Image src={g.imageUrl} alt={g.name} fill className="object-contain" />
                    </div>
                  )}
                  <Link href={`/gadgets/${g.slug}`} className="font-semibold text-white hover:text-indigo-400 transition-colors leading-snug">
                    {g.name}
                  </Link>
                  <span className="text-xs text-gray-400">{g.brand.name}</span>
                  <span className={`font-bold text-sm ${g.priceIdr === minPrice ? "text-emerald-400" : "price-text"}`}>
                    {g.priceIdr === minPrice && gadgets.length > 1 && "💰 "}
                    {formatPriceShort(g.priceIdr)}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, label }, rowIdx) => {
            const values = gadgets.map((g) => getNestedValue(g.specs, key));
            const better = isBetter(key, values);
            return (
              <tr key={key} className={rowIdx % 2 === 0 ? "bg-gray-900/60" : "bg-gray-900/30"}>
                <td className="px-4 py-3 text-gray-400 font-medium">{label}</td>
                {values.map((v, i) => (
                  <td key={i} className={`px-4 py-3 text-center ${better[i] ? "text-emerald-400 font-semibold" : "text-white"}`}>
                    {v}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
