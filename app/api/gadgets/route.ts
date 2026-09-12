import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const category = searchParams.get("category")?.toUpperCase() as
    | "HP"
    | "LAPTOP"
    | null;
  const brand = searchParams.get("brand");
  const q = searchParams.get("q");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const sort = searchParams.get("sort") ?? "name_asc";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(48, Math.max(1, parseInt(searchParams.get("limit") ?? "12")));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isActive: true };

  if (category === "HP" || category === "LAPTOP") {
    where.category = category;
  }

  if (brand) {
    where.brand = { slug: brand };
  }

  if (minPrice || maxPrice) {
    where.priceIdr = {
      ...(minPrice ? { gte: parseInt(minPrice) } : {}),
      ...(maxPrice ? { lte: parseInt(maxPrice) } : {}),
    };
  }

  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }

  const orderBy = (() => {
    switch (sort) {
      case "price_asc":
        return { priceIdr: "asc" as const };
      case "price_desc":
        return { priceIdr: "desc" as const };
      case "name_desc":
        return { name: "desc" as const };
      default:
        return { name: "asc" as const };
    }
  })();

  const [data, total] = await Promise.all([
    prisma.gadget.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { brand: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.gadget.count({ where }),
  ]);

  return Response.json({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
