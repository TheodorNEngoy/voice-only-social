import type { components, paths } from "./types";

export type User = components["schemas"]["User"] | { id: string; handle: string; email?: string };

type FetchOptions = RequestInit & { token?: string };

export class VoxOnlyClient {
  constructor(private baseUrl: string) {}

  private async request<T>(path: string, opts: FetchOptions = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(opts.headers || {})
      }
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  }

  register(body: components["schemas"]["RegisterRequest"]) {
    return this.request("/api/auth/register", { method: "POST", body: JSON.stringify(body) });
  }
}
