import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth";

async function main() {
  await prisma.like.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const password = await hashPassword("Password123!!");
  const alice = await prisma.user.create({ data: { email: "alice@example.com", handle: "alice", name: "Alice", password_hash: password } });
  const bob = await prisma.user.create({ data: { email: "bob@example.com", handle: "bob", name: "Bob", password_hash: password } });
  await prisma.follow.create({ data: { follower_id: alice.id, followee_id: bob.id } });
  const asset = await prisma.audioAsset.create({ data: { s3_key_original: "seed/audio1.wav", status: "ready", s3_key_webm: "seed/audio1.webm" } });
  await prisma.post.create({ data: { author_id: bob.id, audio_asset_id: asset.id, transcript: "Hello world", visibility: "public" } });
  console.log("Seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
