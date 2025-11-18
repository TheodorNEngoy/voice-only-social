"use client";

import { useEffect, useRef, useState } from "react";
import Waveform from "./Waveform";

export interface AudioAssetSummary {
  m4aUrl?: string;
  webmUrl?: string;
  waveformPng?: string;
  waveformPeaks?: number[];
  durationSeconds?: number;
}

export default function AudioPlayer({ asset }: { asset: AudioAssetSummary }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speed, setSpeed] = useState(1);
  const [skipSilences, setSkipSilences] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  return (
    <div className="mt-4 space-y-2 rounded border border-slate-800 p-3" aria-label="Audio player">
      <audio
        ref={audioRef}
        controls
        preload="metadata"
        className="w-full"
        src={asset.webmUrl ?? asset.m4aUrl}
      />
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          Speed
          <select
            aria-label="Playback speed"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded bg-slate-900 p-1"
          >
            {[0.75, 1, 1.25, 1.5].map((value) => (
              <option key={value} value={value}>
                {value}x
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={skipSilences}
            onChange={(event) => setSkipSilences(event.target.checked)}
          />
          Skip silences
        </label>
      </div>
      <Waveform peaks={asset.waveformPeaks} pngUrl={asset.waveformPng} durationSeconds={asset.durationSeconds} />
    </div>
  );
}
