'use server';

import dbConnect from '../../lib/db/mongodb';
import { CoachModel, CoachDocument } from '../../lib/models/Coach';
import { Coach } from '../../domain/types/Coach';

// ─── Helpers ────────────────────────────────────────────────────────────────

function toCoach(doc: CoachDocument): Coach & { id: string } {
  const plain = JSON.parse(JSON.stringify(doc.toObject()));
  return {
    id: String(plain._id),
    name: plain.name,
    email: plain.email,
    authId: plain.authId,
  };
}

// ─── CRUD ───────────────────────────────────────────────────────────────────

export async function createCoach(
  data: Pick<Coach, 'name' | 'email'> & { authId?: string }
): Promise<Coach & { id: string }> {
  await dbConnect();
  const doc = await CoachModel.create({
    name: data.name,
    email: data.email,
    ...(data.authId ? { authId: data.authId } : {}),
  });
  return toCoach(doc);
}

export async function getCoachById(
  id: string
): Promise<(Coach & { id: string }) | null> {
  await dbConnect();
  const doc = await CoachModel.findById(id);
  if (!doc) return null;
  return toCoach(doc);
}

export async function getCoaches(): Promise<(Coach & { id: string })[]> {
  await dbConnect();
  const docs = await CoachModel.find().sort({ name: 1 });
  return docs.map((doc: CoachDocument) => toCoach(doc));
}

export async function getCoachByAuthId(
  authId: string
): Promise<(Coach & { id: string }) | null> {
  await dbConnect();
  const doc = await CoachModel.findOne({ authId });
  if (!doc) return null;
  return toCoach(doc);
}
