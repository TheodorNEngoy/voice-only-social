"use client";

import { useMemo } from "react";
import Image from "next/image";

export default function Waveform({
  peaks,
  pngUrl,
  durationSeconds
}: {
  peaks?: number[];
  pngUrl?: string;
  durationSeconds?: number;
}) {
  const samples = useMemo(() => {
    if (peaks && peaks.length > 0) return peaks;
    return Array.from({ length: 64 }, (_, i) => Math.sin((i / 64) * Math.PI));
  }, [peaks]);

  return (
    <div className="space-y-1" aria-label="Waveform visualization">
      {pngUrl ? (
        <Image src={pngUrl} alt="Waveform" width={600} height={96} className="h-24 w-full rounded object-cover" />
      ) : (
        <div className="flex h-24 items-end gap-0.5">
          {samples.map((value, index) => (
            <span key={index} className="w-full bg-brand" style={{ height: `${Math.abs(value) * 100}%` }} />
          ))}
        </div>
      )}
      {durationSeconds && <p className="text-xs text-slate-400">{durationSeconds.toFixed(1)}s</p>}
    </div>
  );
}
