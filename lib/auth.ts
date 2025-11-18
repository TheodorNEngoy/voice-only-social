import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { env } from "./env";
import { prisma } from "./prisma";
import argon2 from "argon2";

export interface SessionUser {
  id: string;
  handle: string;
  email: string;
}

export interface Session {
  user: SessionUser;
}

const COOKIE_NAME = "vox_session";

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.jwtSecret) as Session;
    return payload;
  } catch (error) {
    console.error("session verify failed", error);
    return null;
  }
}

export async function createSession(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  const token = jwt.sign({ user: { id: user.id, handle: user.handle, email: user.email } }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return token;
}

export async function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function hashPassword(password: string) {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password, { type: argon2.argon2id });
}
