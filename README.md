# VoxOnly

Voice-first social network with transcripts by default for public posts, privacy-preserving DMs, and hardened security defaults.

## Quickstart
1. `docker compose up -d`
2. `npm install`
3. `npx prisma migrate dev`
4. `npm run seed`
5. `npm run dev`

## Architecture
- **Next.js App Router + React + TypeScript** for the web UI and route handlers.
- **PostgreSQL + Prisma** store users, posts, follows, reactions, and reports with FTS-ready transcript fields.
- **Redis + BullMQ worker** handles transcoding, waveform generation, and notification fan-out.
- **MinIO/S3** receives audio uploads via pre-signed PUT URLs. Upload flow: request `/api/uploads/prepare`, `PUT` the blob to S3 with constrained headers, then create the post referencing the returned key.
- **FFmpeg worker** transcodes to AAC/WebM and emits waveform PNG + peak JSON. Whisper transcription honors `STT_ENABLE_PUBLIC_CAPTIONS` (public posts on by default, DMs opt-in per message).
- **OpenAI moderation hook** placeholder ensures transcripts can be scanned server-side prior to feed inclusion.
- **Security**: Argon2id password hashing, JWT-backed HttpOnly cookies, CSRF-resistant POST-only APIs, strict rate limiting, security headers, and encrypted object storage.

## Accessibility
- Captions/transcripts are generated server-side and shown by default for public posts (viewer can toggle visibility in the UI, creators can edit in post composer APIs).
- Recorder + playback controls have visible labels, keyboard focus rings, and accessible timers.
- WCAG 2.2 SC 1.2.1 satisfied by guaranteeing server transcripts for all public content.

## Scripts
- `npm run dev` – Runs Next.js dev server and BullMQ worker.
- `npm run worker` – Standalone worker for background jobs.
- `npm run test` – Vitest unit coverage (feed ranking + env guards).
- `npm run playwright` – Playwright smoke test (sign-up flow placeholder).
- `npm run migrate` – Prisma migration helper.
- `npm run seed` – Seeds demo data.

## Observability & Security
- OpenTelemetry hooks + structured JSON logs in `lib/telemetry.ts` with request IDs ready for propagation.
- HttpOnly, Secure, SameSite=Lax cookies; rate limiting per IP/user for posting, logins, uploads.
- Secrets never checked in; configure via `.env` (see `.env.example`).
- MinIO/S3 objects should be encrypted at rest; only pre-signed URLs with short TTL are issued.

## Testing & CI
GitHub Actions (`.github/workflows/ci.yml`) runs typecheck, lint, unit, Playwright smoke, and build with coverage gates. Local `npm run test` + `npm run playwright` mimic CI.
