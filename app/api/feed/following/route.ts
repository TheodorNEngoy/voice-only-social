import { NextResponse } from "next/server";
import { getServerSession } from "../../../../lib/auth";
import { listFollowingFeed } from "../../../../lib/feed";

export async function GET() {
  const session = await getServerSession();
  const feed = await listFollowingFeed({ userId: session?.user.id });
  return NextResponse.json(feed);
}
