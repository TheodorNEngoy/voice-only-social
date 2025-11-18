import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage",
      include: ["lib/feed-score.ts", "lib/env.ts"],
      lines: 0.6,
      functions: 0.6,
      branches: 0.6,
      statements: 0.6
    }
  }
});
