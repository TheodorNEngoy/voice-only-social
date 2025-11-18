import { NextResponse } from "next/server";
import { z } from "zod";
import { createPresignedUpload } from "../../../../lib/s3";
import { rateLimit } from "../../../../lib/rate-limit";

const schema = z.object({ contentType: z.string(), sizeBytes: z.number().positive().max(25 * 1024 * 1024) });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anon";
  const limit = rateLimit({ key: `upload:${ip}`, limit: 30, windowMs: 60_000 });
  if (!limit.success) return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const upload = await createPresignedUpload(parsed.data);
  return NextResponse.json(upload);
}
