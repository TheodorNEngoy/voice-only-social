import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "../../../lib/auth";
import { rateLimit } from "../../../lib/rate-limit";
import { env } from "../../../lib/env";
import { z } from "zod";

const schema = z.object({ recipient_id: z.string(), audio_key: z.string(), transcribe: z.boolean().optional() });

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const messages = await prisma.message.findMany({
    where: { OR: [{ sender_id: session.user.id }, { recipient_id: session.user.id }] },
    orderBy: { created_at: "desc" },
    take: 50
  });
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const limit = rateLimit({ key: `dm:${session.user.id}`, limit: 30, windowMs: 60_000 });
  if (!limit.success) return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const asset = await prisma.audioAsset.create({ data: { s3_key_original: parsed.data.audio_key, status: "processing" } });
  const message = await prisma.message.create({
    data: {
      sender_id: session.user.id,
      recipient_id: parsed.data.recipient_id,
      audio_asset_id: asset.id
    }
  });
  const transcriptOptIn = env.sttEnableDmTranscripts || parsed.data.transcribe === true;
  return NextResponse.json({ message, transcript_opt_in: transcriptOptIn });
}
