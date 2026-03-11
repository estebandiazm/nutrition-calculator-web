'use server';

import dbConnect from '../../lib/db/mongodb';
import { NutritionistModel, NutritionistDocument } from '../../lib/models/Nutritionist';
import { Nutritionist } from '../../domain/types/Nutritionist';

// ─── Helpers ────────────────────────────────────────────────────────────────

function toNutritionist(doc: NutritionistDocument): Nutritionist & { id: string } {
  const plain = JSON.parse(JSON.stringify(doc.toObject()));
  return {
    id: String(plain._id),
    name: plain.name,
    email: plain.email,
  };
}

// ─── CRUD ───────────────────────────────────────────────────────────────────

export async function createNutritionist(
  data: Pick<Nutritionist, 'name' | 'email'>
): Promise<Nutritionist & { id: string }> {
  await dbConnect();
  const doc = await NutritionistModel.create({
    name: data.name,
    email: data.email,
  });
  return toNutritionist(doc);
}

export async function getNutritionistById(
  id: string
): Promise<(Nutritionist & { id: string }) | null> {
  await dbConnect();
  const doc = await NutritionistModel.findById(id);
  if (!doc) return null;
  return toNutritionist(doc);
}

export async function getNutritionists(): Promise<(Nutritionist & { id: string })[]> {
  await dbConnect();
  const docs = await NutritionistModel.find().sort({ name: 1 });
  return docs.map((doc: NutritionistDocument) => toNutritionist(doc));
}
