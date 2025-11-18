"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface RecorderState {
  status: "idle" | "recording" | "paused" | "error";
  error?: string;
  seconds: number;
}

export default function Recorder() {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [state, setState] = useState<RecorderState>({ status: "idle", seconds: 0 });
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied">("unknown");

  useEffect(() => {
    navigator.permissions
      ?.query({ name: "microphone" as PermissionName })
      .then((status) => setPermission(status.state as any))
      .catch(() => setPermission("unknown"));
  }, []);

  const requestStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/mp4"
    });
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.current.push(event.data);
    };
    recorder.onstop = () => setState((prev) => ({ ...prev, status: "idle" }));
    mediaRecorder.current = recorder;
    setPermission("granted");
    return recorder;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const recorder = mediaRecorder.current ?? (await requestStream());
      chunks.current = [];
      recorder.start();
      setState({ status: "recording", seconds: 0 });
      const timer = setInterval(() => {
        setState((prev) => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
      recorder.addEventListener(
        "stop",
        () => {
          clearInterval(timer);
        },
        { once: true }
      );
    } catch (error) {
      setState({ status: "error", seconds: 0, error: (error as Error).message });
    }
  }, [requestStream]);

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorder.current;
    if (!recorder) return;
    recorder.stop();
    const blob = new Blob(chunks.current, { type: recorder.mimeType });
    // TODO: Upload path; placeholder for UI to show selected file
    console.info("Recorded blob", blob.size);
  }, []);

  const togglePause = useCallback(() => {
    const recorder = mediaRecorder.current;
    if (!recorder) return;
    if (recorder.state === "recording") {
      recorder.pause();
      setState((prev) => ({ ...prev, status: "paused" }));
    } else if (recorder.state === "paused") {
      recorder.resume();
      setState((prev) => ({ ...prev, status: "recording" }));
    }
  }, []);

  const trimLastFiveSeconds = useCallback(() => {
    if (chunks.current.length === 0) return;
    chunks.current = chunks.current.slice(0, Math.max(0, chunks.current.length - 5));
    setState((prev) => ({ ...prev, seconds: Math.max(0, prev.seconds - 5) }));
  }, []);

  return (
    <section className="rounded-2xl border border-slate-800 p-6" aria-label="Record new post">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Record</h2>
          <p className="text-sm text-slate-400">Permission: {permission}</p>
        </div>
        <span aria-live="polite" className="font-mono text-lg">
          {new Date(state.seconds * 1000).toISOString().substring(14, 19)}
        </span>
      </header>
      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          className={clsx("rounded-full px-6 py-3 font-semibold focus-visible:outline", {
            "bg-green-500 text-black": state.status !== "recording",
            "bg-red-600": state.status === "recording"
          })}
          onClick={state.status === "recording" ? stopRecording : startRecording}
          aria-pressed={state.status === "recording"}
        >
          {state.status === "recording" ? "Stop" : "Record"}
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-600 px-4 py-2 text-sm"
          onClick={togglePause}
          disabled={state.status === "idle"}
        >
          {state.status === "paused" ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-600 px-4 py-2 text-sm"
          onClick={trimLastFiveSeconds}
          disabled={state.seconds < 5}
        >
          Trim last 5s
        </button>
      </div>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
    </section>
  );
}
