// Utility functions for Specrix

/** Format number to IDR currency string */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Shorten IDR price: 2500000 → "Rp 2,5 Juta" */
export function formatPriceShort(price: number): string {
  if (price >= 1_000_000_000) {
    return `Rp ${(price / 1_000_000_000).toFixed(1)} M`;
  }
  if (price >= 1_000_000) {
    return `Rp ${(price / 1_000_000).toFixed(1)} Juta`;
  }
  if (price >= 1_000) {
    return `Rp ${(price / 1_000).toFixed(0)} Ribu`;
  }
  return formatPrice(price);
}

/** Convert string to URL-safe slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

/** Build query string from object, omitting null/undefined/empty values */
export function buildQuery(
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== null && v !== undefined && v !== "") {
      sp.set(k, String(v));
    }
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
