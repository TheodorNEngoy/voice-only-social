import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getServerSession } from "../../../../../lib/auth";
import { z } from "zod";

const schema = z.object({ reason: z.string().min(3).max(1024) });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const report = await prisma.report.findUnique({ where: { id: params.id } });
  if (!report) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const appeal = await prisma.appeal.create({
    data: {
      report_id: report.id,
      user_id: session.user.id,
      reason: parsed.data.reason
    }
  });
  return NextResponse.json({ appeal });
}
