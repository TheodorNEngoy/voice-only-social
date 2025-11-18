import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "../../../lib/auth";
import { rateLimit } from "../../../lib/rate-limit";

const schema = z.object({
  audio_key: z.string(),
  visibility: z.enum(["public", "unlisted", "followers"]),
  parent_post_id: z.string().optional(),
  quote_post_id: z.string().optional(),
  transcript: z.string().optional()
});

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { created_at: "desc" }, take: 50, include: { author: true } });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const ip = request.headers.get("x-forwarded-for") ?? "anon";
  const limit = rateLimit({ key: `post:${session.user.id}:${ip}`, limit: 12, windowMs: 60_000 });
  if (!limit.success) return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const asset = await prisma.audioAsset.create({
    data: {
      s3_key_original: parsed.data.audio_key,
      status: "processing"
    }
  });
  const post = await prisma.post.create({
    data: {
      author_id: session.user.id,
      audio_asset_id: asset.id,
      parent_post_id: parsed.data.parent_post_id,
      quote_post_id: parsed.data.quote_post_id,
      visibility: parsed.data.visibility,
      transcript: parsed.data.transcript
    }
  });
  return NextResponse.json({ post });
}
