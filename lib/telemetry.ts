import { context, trace } from "@opentelemetry/api";
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  transport: process.env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined
});

export function withRequestId<T>(requestId: string, fn: () => Promise<T>) {
  return context.with(trace.setSpan(context.active(), trace.getSpan(context.active()) ?? ({} as any)), fn);
}
