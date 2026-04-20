import crypto from 'crypto';

export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(18).toString('hex');
  return `sk_client_${randomBytes}`;
}
