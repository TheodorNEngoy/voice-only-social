import Link from "next/link";
import Recorder from "../components/Recorder";
import AudioPlayer from "../components/AudioPlayer";
import Transcript from "../components/Transcript";
import { Suspense } from "react";
import { getServerSession } from "../lib/auth";
import { listFollowingFeed, listForYouFeed } from "../lib/feed";

export default async function HomePage() {
  const session = await getServerSession();
  const feed = await listFollowingFeed({ userId: session?.user.id });
  const forYou = await listForYouFeed();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">VoxOnly</h1>
        <p className="text-slate-300">Voice-only social. Captions on, privacy honored.</p>
        {!session && (
          <div className="flex gap-4">
            <Link className="underline" href="/auth/login">
              Login
            </Link>
            <Link className="underline" href="/auth/register">
              Sign up
            </Link>
          </div>
        )}
      </header>
      <Recorder />
      <section aria-label="Following feed" className="space-y-4">
        <h2 className="text-xl font-semibold">Following</h2>
        <Suspense fallback={<p>Loading…</p>}>
          <ul className="space-y-4">
            {feed.items.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-800 p-4">
                <div className="flex items-center justify-between">
                  <strong>@{item.author.handle}</strong>
                  <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleString()}</span>
                </div>
                <Transcript text={item.transcript} />
                <AudioPlayer asset={item.audio} />
              </li>
            ))}
          </ul>
        </Suspense>
      </section>
      <section aria-label="For you feed" className="space-y-4">
        <h2 className="text-xl font-semibold">For you</h2>
        <ul className="space-y-4">
          {forYou.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-800 p-4">
              <div className="flex items-center justify-between">
                <strong>@{item.author.handle}</strong>
                <span className="text-xs text-slate-400">score {item.score.toFixed(2)}</span>
              </div>
              <Transcript text={item.transcript} />
              <AudioPlayer asset={item.audio} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
