import { logger } from "./lib/telemetry";

export function register() {
  logger.info({ msg: "otel instrumentation registered" });
}
