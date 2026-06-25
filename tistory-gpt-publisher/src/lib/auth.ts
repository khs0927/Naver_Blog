import { NextRequest } from 'next/server';

export function requireApiKey(req: NextRequest) {
  const expected = process.env.APP_API_KEY;
  if (!expected) throw new Error('APP_API_KEY is not configured');
  const actual = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (actual !== expected) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export function requireWorkerSecret(req: NextRequest) {
  const expected = process.env.WORKER_SECRET;
  if (!expected) throw new Error('WORKER_SECRET is not configured');
  const actual = req.headers.get('x-worker-secret') || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (actual !== expected) {
    return Response.json({ error: 'Unauthorized worker' }, { status: 401 });
  }
  return null;
}
