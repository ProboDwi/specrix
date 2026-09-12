"use client";
import Image from "next/image";
import Link from "next/link";
import PriceTag from "./PriceTag";
import CompareButton from "./CompareButton";

interface GadgetCardProps {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: { name: string; slug: string };
  priceIdr: number;
  imageUrl: string | null;
  shortDesc: string | null;
  specs: Record<string, unknown>;
}

export default function GadgetCard({
  id, name, slug, category, brand, priceIdr, imageUrl, shortDesc, specs,
}: GadgetCardProps) {
  const hp = specs as { chipset?: string; ram?: string; storage?: string };
  const lt = specs as { cpu?: string; ram?: string; storage?: string };

  const keySpecs =
    category === "HP"
      ? [hp.chipset, hp.ram, hp.storage]
      : [lt.cpu?.split(" ").slice(0, 4).join(" "), lt.ram, lt.storage];

  return (
    <div className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 flex flex-col">
      <Link href={`/gadgets/${slug}`} className="block flex-1">
        <div className="aspect-[4/3] bg-gray-800 relative overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              category === "HP"
                ? "bg-emerald-900/80 text-emerald-300"
                : "bg-blue-900/80 text-blue-300"
            }`}>
              {category === "HP" ? "Smartphone" : "Laptop"}
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{brand.name}</p>
          <h3 className="font-semibold text-white text-sm leading-snug mb-2 line-clamp-2">{name}</h3>
          <PriceTag price={priceIdr} short className="text-base" />
          <div className="mt-3 flex flex-wrap gap-1">
            {keySpecs.filter(Boolean).map((s, i) => (
              <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                {s}
              </span>
            ))}
          </div>
          {shortDesc && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{shortDesc}</p>
          )}
        </div>
      </Link>
      <div className="px-4 pb-4">
        <CompareButton gadgetId={id} gadgetName={name} gadgetSlug={slug} />
      </div>
    </div>
  );
}
