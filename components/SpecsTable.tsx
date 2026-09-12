interface SpecsTableProps {
  specs: Record<string, unknown>;
  category: string;
}

function renderValue(v: unknown): string {
  if (v === null || v === undefined) return "-";
  if (typeof v === "boolean") return v ? "Ya" : "Tidak";
  if (typeof v === "object") {
    return Object.entries(v as Record<string, unknown>)
      .map(([k, val]) => `${val}`)
      .join(", ");
  }
  return String(v);
}

const HP_SPEC_LABELS: Record<string, string> = {
  chipset: "Chipset",
  cpu: "CPU",
  gpu: "GPU",
  ram: "RAM",
  storage: "Penyimpanan",
  expandableStorage: "MicroSD",
  display: "Layar",
  rearCamera: "Kamera Belakang",
  frontCamera: "Kamera Depan",
  battery: "Baterai",
  os: "Sistem Operasi",
  connectivity: "Konektivitas",
  dimensions: "Dimensi",
  weight: "Berat",
  waterResistance: "Ketahanan Air",
  fingerprint: "Sidik Jari",
};

const LAPTOP_SPEC_LABELS: Record<string, string> = {
  cpu: "Prosesor",
  gpu: "Kartu Grafis",
  ram: "RAM",
  storage: "Penyimpanan",
  display: "Layar",
  battery: "Baterai",
  os: "Sistem Operasi",
  ports: "Port",
  keyboard: "Keyboard",
  connectivity: "Konektivitas",
  dimensions: "Dimensi",
  weight: "Berat",
  touchscreen: "Layar Sentuh",
};

export default function SpecsTable({ specs, category }: SpecsTableProps) {
  const labels = category === "HP" ? HP_SPEC_LABELS : LAPTOP_SPEC_LABELS;
  const entries = Object.entries(labels)
    .map(([key, label]) => ({ key, label, value: specs[key] }))
    .filter(({ value }) => value !== undefined && value !== null);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(({ key, label, value }, i) => (
            <tr key={key} className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50"}>
              <td className="px-4 py-3 text-gray-400 font-medium w-2/5 align-top">{label}</td>
              <td className="px-4 py-3 text-white">{renderValue(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
