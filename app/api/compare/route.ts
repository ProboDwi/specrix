import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slugsParam = searchParams.get("slugs");

  if (!slugsParam) {
    return Response.json(
      { error: "Parameter 'slugs' wajib diisi (pisahkan dengan koma, maks 3)" },
      { status: 400 }
    );
  }

  const slugs = slugsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (slugs.length < 2) {
    return Response.json(
      { error: "Minimal 2 gadget untuk dibandingkan" },
      { status: 400 }
    );
  }

  const gadgets = await prisma.gadget.findMany({
    where: { slug: { in: slugs }, isActive: true },
    include: { brand: { select: { id: true, name: true, slug: true } } },
  });

  // Preserve the order requested by the client
  const ordered = slugs
    .map((slug) => gadgets.find((g) => g.slug === slug))
    .filter(Boolean);

  return Response.json(ordered);
}
