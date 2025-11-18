import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "../../../lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const notifications = await prisma.notification.findMany({
    where: { user_id: session.user.id },
    take: 20,
    orderBy: { created_at: "desc" },
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined
  });
  const nextCursor = notifications.at(-1)?.id;
  return NextResponse.json({ notifications, nextCursor });
}
