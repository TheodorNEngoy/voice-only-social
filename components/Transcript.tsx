"use client";

import { useState } from "react";

export default function Transcript({ text }: { text?: string | null }) {
  const [visible, setVisible] = useState(true);
  if (!text) return <p className="text-sm text-slate-400">Transcript pending</p>;
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="text-xs text-brand underline focus-visible:outline"
        aria-pressed={visible}
      >
        {visible ? "Hide captions" : "Show captions"}
      </button>
      {visible && <p className="text-sm text-slate-200">{text}</p>}
    </div>
  );
}
