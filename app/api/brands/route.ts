import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category")?.toUpperCase() as
    | "HP"
    | "LAPTOP"
    | null;

  const brands = await prisma.brand.findMany({
    where: category
      ? { gadgets: { some: { category, isActive: true } } }
      : { gadgets: { some: { isActive: true } } },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { gadgets: { where: { isActive: true } } },
      },
    },
  });

  return Response.json(brands);
}
