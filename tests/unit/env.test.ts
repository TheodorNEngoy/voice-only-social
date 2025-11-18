import { describe, expect, it } from "vitest";
import { env } from "../../lib/env";

describe("env", () => {
  it("exposes defaults", () => {
    expect(env.appBaseUrl).toBeDefined();
    expect(typeof env.sttEnablePublicCaptions).toBe("boolean");
  });
});
