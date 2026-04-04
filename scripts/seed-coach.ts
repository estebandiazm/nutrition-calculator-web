// Seed script: creates a default Coach document and prints its _id
// Usage: npx -y tsx scripts/seed-coach.ts

import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read MONGODB_URI from .env.local manually
const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
const match = envContent.match(/^MONGODB_URI=(.+)$/m);
if (!match) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}
const MONGODB_URI = match[1].trim();

// Inline schema to avoid Next.js import issues
const CoachSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    authId: { type: String, sparse: true, index: true, unique: true },
  },
  { timestamps: true, collection: 'coaches' }
);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const Coach =
    mongoose.models.Coach ||
    mongoose.model('Coach', CoachSchema);

  // Check if one already exists
  const existing = await Coach.findOne();
  if (existing) {
    console.log(`\nCoach already exists:`);
    console.log(`  _id:   ${existing._id}`);
    console.log(`  name:  ${existing.name}`);
    console.log(`  email: ${existing.email}`);
    console.log(`\nSet in .env.local:\nNEXT_PUBLIC_DEFAULT_COACH_ID=${existing._id}`);
    await mongoose.disconnect();
    return;
  }

  const doc = await Coach.create({
    name: 'Juan Esteban Diaz',
    email: 'coach@example.com',
  });

  console.log(`\nCoach created:`);
  console.log(`  _id:   ${doc._id}`);
  console.log(`  name:  ${doc.name}`);
  console.log(`  email: ${doc.email}`);
  console.log(`\nSet in .env.local:\nNEXT_PUBLIC_DEFAULT_COACH_ID=${doc._id}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
