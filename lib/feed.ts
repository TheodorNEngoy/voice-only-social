import { prisma } from "./prisma";
import { scoreForYou, defaultWeights } from "./feed-score";

export async function listFollowingFeed({ userId }: { userId?: string | undefined }) {
  const query = userId
    ? {
        where: {
          author: {
            followers: { some: { follower_id: userId } }
          }
        }
      }
    : {};
  const posts = await prisma.post.findMany({
    ...query,
    orderBy: { created_at: "desc" },
    take: userId ? 20 : 5,
    include: { author: true, audio_asset: true }
  });
  return { items: posts.map(formatPost), weights: defaultWeights };
}

interface FeedItem {
  id: string;
  created_at: Date;
  transcript?: string | null;
  author: { id: string; handle: string };
  audio: {
    m4aUrl?: string | null;
    webmUrl?: string | null;
    waveformPng?: string | null;
    durationSeconds?: number | null;
  };
}

function formatPost(post: any): FeedItem {
  return {
    id: post.id,
    created_at: post.created_at,
    transcript: post.transcript,
    author: {
      id: post.author.id,
      handle: post.author.handle
    },
    audio: {
      m4aUrl: post.audio_asset?.s3_key_m4a,
      webmUrl: post.audio_asset?.s3_key_webm,
      waveformPng: post.audio_asset?.s3_key_waveform,
      durationSeconds: post.audio_asset?.duration_seconds
    }
  };
}
