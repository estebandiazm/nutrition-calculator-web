import dbConnect from '../../../lib/db/mongodb';
import { ClientModel } from '../../../lib/models/Client';

export async function validateApiKey(clientId: string, apiKey: string): Promise<boolean> {
  try {
    await dbConnect();
    const client = await ClientModel.findById(clientId);

    if (!client || !client.apiKey) {
      return false;
    }

    return client.apiKey === apiKey;
  } catch {
    return false;
  }
}
