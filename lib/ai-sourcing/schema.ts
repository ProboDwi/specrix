// Canonical schema for AI-sourced gadget data
// When running the data pipeline, output must conform to this structure

export interface AiSourcedGadget {
  name: string;           // Full product name, e.g. "Samsung Galaxy S24 FE"
  brand: string;          // Brand slug, must match existing Brand.slug
  category: "HP" | "LAPTOP";
  priceIdr: number;       // Price in IDR as integer
  imageUrl?: string;      // Direct image URL from official source
  shortDesc?: string;     // 1-2 sentence summary in Indonesian
  sourceUrl: string;      // Primary source URL used for this data
  crossCheckUrl?: string; // Secondary source URL for validation
  specs: HpSpecs | LaptopSpecs;
}

export interface HpSpecs {
  chipset: string;
  cpu?: string;
  gpu?: string;
  ram: string;
  storage: string;
  expandableStorage?: boolean;
  display: {
    size: string;
    resolution: string;
    type: string;
    refreshRate?: string;
  };
  rearCamera: string;
  frontCamera: string;
  battery: {
    capacity: string;
    charging?: string;
  };
  os: string;
  connectivity: string;
  dimensions?: string;
  weight?: string;
  waterResistance?: string;
  fingerprint?: string;
}

export interface LaptopSpecs {
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  display: {
    size: string;
    resolution: string;
    type: string;
    refreshRate?: string;
  };
  battery: {
    capacity: string;
    charging?: string;
  };
  os: string;
  ports: string;
  keyboard?: string;
  connectivity?: string;
  dimensions?: string;
  weight?: string;
  touchscreen?: boolean;
}
