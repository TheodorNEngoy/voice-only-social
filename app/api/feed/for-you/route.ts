import { NextResponse } from "next/server";
import { listForYouFeed } from "../../../../lib/feed";

export async function GET() {
  const ranked = await listForYouFeed();
  return NextResponse.json({ items: ranked });
}
