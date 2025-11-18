import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "../lib/env";
import { runFfmpeg } from "../lib/ffmpeg";
import { prisma } from "../lib/prisma";
import { logger } from "../lib/telemetry";

const connection = new IORedis(env.redisUrl);

export const mediaQueue = new Queue("media", { connection });

const worker = new Worker(
  "media",
  async (job) => {
    logger.info({ jobId: job.id, type: job.name }, "processing audio");
    if (job.name === "transcode") {
      await runFfmpeg(["-i", job.data.input, job.data.output]);
    }
    if (job.name === "mark-ready") {
      await prisma.audioAsset.update({ where: { id: job.data.assetId }, data: { status: "ready" } });
    }
  },
  { connection, concurrency: env.processingConcurrency }
);

worker.on("completed", (job) => logger.info({ jobId: job.id }, "job completed"));
worker.on("failed", (job, err) => logger.error({ jobId: job?.id, err }, "job failed"));
