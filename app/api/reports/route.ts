import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "../../../lib/auth";
import { z } from "zod";

const schema = z.object({
  subject_type: z.enum(["user", "post", "message"]),
  subject_id: z.string(),
  reason: z.enum(["abuse", "spam", "impersonation", "other"]),
  notes: z.string().max(1024).optional()
});

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const report = await prisma.report.create({
    data: {
      reporter_id: session.user.id,
      subject_type: parsed.data.subject_type,
      subject_id: parsed.data.subject_id,
      reason: parsed.data.reason,
      notes: parsed.data.notes
    }
  });
  return NextResponse.json({ report });
}
