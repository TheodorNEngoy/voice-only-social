import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getServerSession } from "../../../../../lib/auth";

async function resolveUser(handle: string) {
  return prisma.user.findUnique({ where: { handle } });
}

export async function POST(_: Request, { params }: { params: { handle: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const target = await resolveUser(params.handle);
  if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await prisma.follow.upsert({
    where: { follower_id_followee_id: { follower_id: session.user.id, followee_id: target.id } },
    update: {},
    create: { follower_id: session.user.id, followee_id: target.id }
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { handle: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const target = await resolveUser(params.handle);
  if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await prisma.follow.deleteMany({ where: { follower_id: session.user.id, followee_id: target.id } });
  return NextResponse.json({ ok: true });
}
