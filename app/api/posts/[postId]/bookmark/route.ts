import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getServerSession } from "../../../../../lib/auth";

export async function POST(_: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await prisma.bookmark.upsert({
    where: { user_id_post_id: { user_id: session.user.id, post_id: params.postId } },
    update: {},
    create: { user_id: session.user.id, post_id: params.postId }
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await prisma.bookmark.delete({ where: { user_id_post_id: { user_id: session.user.id, post_id: params.postId } } });
  return NextResponse.json({ ok: true });
}
