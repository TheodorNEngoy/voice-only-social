import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { hashPassword, createSession } from "../../../../lib/auth";
import { rateLimit } from "../../../../lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
  handle: z.string().min(3).max(32).regex(/^[a-z0-9_]+$/i),
  name: z.string().min(1)
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anon";
  const limit = rateLimit({ key: `register:${ip}`, limit: 10, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  const { email, password, handle, name } = parsed.data;
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, handle, name, password_hash: passwordHash } });
  await createSession(user.id);
  return NextResponse.json({ user: { id: user.id, handle: user.handle, email: user.email } });
}
