import { describe, expect, it } from "vitest";
import { scoreForYou } from "../../lib/feed-score";

describe("scoreForYou", () => {
  it("ranks recent content higher", () => {
    const now = new Date();
    const recent = scoreForYou({ created_at: now, listens: 1, engagements: 1, reports: 0 });
    const old = scoreForYou({ created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7), listens: 1, engagements: 1, reports: 0 });
    expect(recent).toBeGreaterThan(old);
  });

  it("penalizes reports", () => {
    const clean = scoreForYou({ created_at: new Date(), listens: 1, engagements: 1, reports: 0 });
    const reported = scoreForYou({ created_at: new Date(), listens: 1, engagements: 1, reports: 5 });
    expect(clean).toBeGreaterThan(reported);
  });
});
