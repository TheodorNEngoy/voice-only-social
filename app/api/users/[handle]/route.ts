import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(_: Request, { params }: { params: { handle: string } }) {
  const user = await prisma.user.findUnique({ where: { handle: params.handle }, include: { _count: { select: { followers: true, following: true } } } });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({
    user: {
      id: user.id,
      handle: user.handle,
      name: user.name,
      bio: user.bio,
      avatar_url: user.avatar_url,
      followers: user._count.followers,
      following: user._count.following
    }
  });
}
