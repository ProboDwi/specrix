import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/gadgets/[slug]">
) {
  const { slug } = await ctx.params;

  const gadget = await prisma.gadget.findUnique({
    where: { slug, isActive: true },
    include: { brand: { select: { id: true, name: true, slug: true } } },
  });

  if (!gadget) {
    return Response.json({ error: "Gadget tidak ditemukan" }, { status: 404 });
  }

  return Response.json(gadget);
}
