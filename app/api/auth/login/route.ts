import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { verifyPassword, createSession } from "../../../../lib/auth";
import { rateLimit } from "../../../../lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anon";
  const limit = rateLimit({ key: `login:${ip}`, limit: 20, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }
  const valid = await verifyPassword(user.password_hash, password);
  if (!valid) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ user: { id: user.id, handle: user.handle, email: user.email } });
}
