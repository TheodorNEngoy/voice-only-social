const required = [
  "APP_BASE_URL",
  "DATABASE_URL",
  "REDIS_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "S3_REGION",
  "S3_BUCKET",
  "S3_PUBLIC_BUCKET"
] as const;

required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[env] Missing ${key}. Some features may not work until it is provided.`);
  }
});

export const env = {
  appBaseUrl: process.env.APP_BASE_URL ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL ?? "",
  redisUrl: process.env.REDIS_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  s3Region: process.env.S3_REGION ?? "us-east-1",
  s3Bucket: process.env.S3_BUCKET ?? "voxonly-media",
  s3PublicBucket: process.env.S3_PUBLIC_BUCKET ?? "voxonly-public",
  ffmpegPath: process.env.FFMPEG_PATH ?? "ffmpeg",
  processingConcurrency: Number(process.env.PROCESSING_CONCURRENCY ?? 2),
  sttProvider: process.env.STT_PROVIDER ?? "openai",
  sttLanguage: process.env.STT_LANGUAGE ?? "auto",
  sttEnablePublicCaptions: process.env.STT_ENABLE_PUBLIC_CAPTIONS !== "false",
  sttEnableDmTranscripts: process.env.STT_ENABLE_DM_TRANSCRIPTS === "true",
  moderationProvider: process.env.MODERATION_PROVIDER ?? "openai"
};
