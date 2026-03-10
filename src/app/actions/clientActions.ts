'use server';

import dbConnect from '../../lib/db/mongodb';
import { ClientModel, ClientDocument } from '../../lib/models/Client';
import { Client } from '../../domain/types/Client';
import { DietPlan } from '../../domain/types/DietPlan';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Deep-serialise a Mongoose document into a plain JS object safe for
 * the Next.js Server → Client Component boundary.
 * JSON round-trip converts ObjectIds → strings, Dates → ISO strings,
 * and strips any toJSON / prototype references.
 */
function toClient(doc: ClientDocument): Client & { id: string } {
  const plain = JSON.parse(JSON.stringify(doc.toObject()));
  return {
    id: String(plain._id),
    name: plain.name,
    targetWeight: plain.targetWeight,
    plans: (plain.plans ?? []).map(sanitisePlan),
  };
}

/** Strip Mongo internals from an embedded plan object. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitisePlan(plan: any): DietPlan {
  const { _id, __v, ...rest } = plan;
  return rest as DietPlan;
}

// ─── Client CRUD ────────────────────────────────────────────────────────────

export async function createClient(
  data: Pick<Client, 'name'> & Partial<Pick<Client, 'targetWeight'>>
): Promise<Client & { id: string }> {
  await dbConnect();
  const doc = await ClientModel.create({
    name: data.name,
    targetWeight: data.targetWeight,
    plans: [],
  });
  return toClient(doc);
}

export async function getClients(): Promise<(Client & { id: string })[]> {
  await dbConnect();
  const docs = await ClientModel.find().sort({ updatedAt: -1 }).lean();
  return docs.map((doc: any) => {
    const plain = JSON.parse(JSON.stringify(doc));
    return {
      id: String(plain._id),
      name: plain.name,
      targetWeight: plain.targetWeight,
      plans: (plain.plans ?? []).map(sanitisePlan),
    };
  });
}

export async function getClientById(
  id: string
): Promise<(Client & { id: string }) | null> {
  await dbConnect();
  const doc = await ClientModel.findById(id);
  if (!doc) return null;
  return toClient(doc);
}

export async function updateClient(
  id: string,
  data: Partial<Pick<Client, 'name' | 'targetWeight'>>
): Promise<(Client & { id: string }) | null> {
  await dbConnect();
  const doc = await ClientModel.findByIdAndUpdate(id, data, { new: true });
  if (!doc) return null;
  return toClient(doc);
}

// ─── Diet Plan ──────────────────────────────────────────────────────────────

export async function addDietPlanToClient(
  clientId: string,
  plan: DietPlan
): Promise<(Client & { id: string }) | null> {
  await dbConnect();
  const doc = await ClientModel.findByIdAndUpdate(
    clientId,
    { $push: { plans: plan } },
    { new: true }
  );
  if (!doc) return null;
  return toClient(doc);
}
