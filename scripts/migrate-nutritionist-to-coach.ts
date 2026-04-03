import { config } from 'dotenv';
config({ path: '.env.local' });

async function migrate() {
  const { default: mongoose } = await import('mongoose');
  const { default: dbConnect } = await import('../src/lib/db/mongodb');

  await dbConnect();
  const db = mongoose.connection.db!;

  // Step 1: Count source documents
  const nutritionistCount = await db.collection('nutritionists').countDocuments();
  console.log(`Found ${nutritionistCount} nutritionist documents`);

  // Step 2: Idempotent guard
  const coachCount = await db.collection('coaches').countDocuments();
  if (coachCount > 0) {
    console.log(`coaches collection already has ${coachCount} documents — skipping copy`);
  } else {
    // Step 3: Copy nutritionists → coaches
    const nutritionists = await db.collection('nutritionists').find({}).toArray();
    if (nutritionists.length > 0) {
      await db.collection('coaches').insertMany(nutritionists);
      console.log(`Copied ${nutritionists.length} documents to coaches collection`);
    }
  }

  // Step 4: Add authId: null to coaches missing the field
  await db.collection('coaches').updateMany(
    { authId: { $exists: false } },
    { $set: { authId: null } }
  );

  // Step 5: Rename nutritionistId → coachId in clients
  const clientsWithOldField = await db.collection('clients').countDocuments({ nutritionistId: { $exists: true } });
  if (clientsWithOldField > 0) {
    await db.collection('clients').updateMany(
      { nutritionistId: { $exists: true } },
      { $rename: { nutritionistId: 'coachId' } }
    );
    console.log(`Renamed nutritionistId → coachId in ${clientsWithOldField} client documents`);
  }

  // Step 6: Validate
  const finalCoachCount = await db.collection('coaches').countDocuments();
  const remainingOldField = await db.collection('clients').countDocuments({ nutritionistId: { $exists: true } });

  if (finalCoachCount < nutritionistCount) {
    console.error(`VALIDATION FAILED: Expected ${nutritionistCount} coaches, got ${finalCoachCount}`);
    process.exit(1);
  }
  if (remainingOldField > 0) {
    console.error(`VALIDATION FAILED: ${remainingOldField} clients still have nutritionistId field`);
    process.exit(1);
  }

  // Step 7: Done
  console.log('Migration complete. Old "nutritionists" collection preserved.');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
