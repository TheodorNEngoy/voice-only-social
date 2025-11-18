export const defaultWeights = {
  recency: 0.4,
  listenThrough: 0.2,
  engagement: 0.25,
  network: 0.1,
  reports: 0.05
};

export function scoreForYou(post: { created_at: Date; listens: number; engagements: number; reports: number }) {
  const now = Date.now();
  const ageHours = (now - post.created_at.getTime()) / 36e5;
  const score =
    defaultWeights.recency * Math.exp(-ageHours / 24) +
    defaultWeights.listenThrough * post.listens +
    defaultWeights.engagement * post.engagements -
    defaultWeights.reports * post.reports;
  return score;
}
