// TypeScript types for Specrix gadget data

export type GadgetCategory = "HP" | "LAPTOP";

// ── Shared spec fields ─────────────────────────────────────────────────────

export interface DisplaySpec {
  size: string;        // e.g. "6.7 inci"
  resolution: string;  // e.g. "1080 x 2400"
  type: string;        // e.g. "AMOLED", "IPS LCD"
  refreshRate?: string; // e.g. "120Hz"
}

export interface BatterySpec {
  capacity: string;    // e.g. "5000 mAh"
  charging?: string;   // e.g. "67W Fast Charging"
}

// ── HP / Smartphone specs ──────────────────────────────────────────────────

export interface HpSpecs {
  chipset: string;       // e.g. "Snapdragon 8 Gen 3"
  cpu?: string;          // detail CPU cores
  gpu?: string;
  ram: string;           // e.g. "8 GB"
  storage: string;       // e.g. "256 GB"
  expandableStorage?: boolean;
  display: DisplaySpec;
  rearCamera: string;    // e.g. "50 MP + 12 MP + 10 MP"
  frontCamera: string;   // e.g. "12 MP"
  battery: BatterySpec;
  os: string;            // e.g. "Android 14"
  connectivity: string;  // e.g. "5G, Wi-Fi 6E, Bluetooth 5.3"
  dimensions?: string;
  weight?: string;       // e.g. "195 gram"
  waterResistance?: string; // e.g. "IP68"
  fingerprint?: string;  // e.g. "Under-display optical"
}

// ── Laptop specs ───────────────────────────────────────────────────────────

export interface LaptopSpecs {
  cpu: string;           // e.g. "Intel Core Ultra 7 155H"
  gpu: string;           // e.g. "NVIDIA RTX 4060 8GB"
  ram: string;           // e.g. "16 GB DDR5"
  storage: string;       // e.g. "512 GB NVMe SSD"
  display: DisplaySpec;
  battery: BatterySpec;
  os: string;            // e.g. "Windows 11 Home"
  ports: string;         // e.g. "2x USB-A, 2x USB-C (TB4), HDMI 2.1, SD Card"
  keyboard?: string;     // e.g. "Backlit, numpad"
  connectivity?: string; // e.g. "Wi-Fi 6E, Bluetooth 5.3"
  dimensions?: string;
  weight?: string;       // e.g. "1.8 kg"
  touchscreen?: boolean;
}

export type GadgetSpecs = HpSpecs | LaptopSpecs;

// ── API response types ─────────────────────────────────────────────────────

export interface GadgetListItem {
  id: string;
  name: string;
  slug: string;
  category: GadgetCategory;
  brand: { id: string; name: string; slug: string };
  priceIdr: number;
  imageUrl: string | null;
  shortDesc: string | null;
  specs: GadgetSpecs;
}

export interface GadgetDetail extends GadgetListItem {
  sourceUrl: string | null;
  lastVerifiedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrandListItem {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  _count: { gadgets: number };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
