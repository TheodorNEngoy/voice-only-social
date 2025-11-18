"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
    if (res.ok) window.location.href = "/";
    else setError("Unable to register");
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm">
          Handle
          <input name="handle" minLength={3} required className="mt-1 w-full rounded bg-slate-900 p-2" />
        </label>
        <label className="block text-sm">
          Name
          <input name="name" required className="mt-1 w-full rounded bg-slate-900 p-2" />
        </label>
        <label className="block text-sm">
          Email
          <input name="email" type="email" required className="mt-1 w-full rounded bg-slate-900 p-2" />
        </label>
        <label className="block text-sm">
          Password
          <input name="password" type="password" required minLength={12} className="mt-1 w-full rounded bg-slate-900 p-2" />
        </label>
        <button disabled={loading} className="w-full rounded bg-brand px-4 py-2 font-semibold text-black">
          {loading ? "Creating" : "Create account"}
        </button>
      </form>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </main>
  );
}
