import { NextRequest } from 'next/server';
import { requireApiKey } from '@/lib/auth';
import { dispatchPublishJob } from '@/lib/github';

export async function POST(req: NextRequest) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => ({}));
  const jobId = body.jobId as string | undefined;
  if (!jobId) {
    return Response.json({ error: 'jobId is required' }, { status: 400 });
  }

  const result = await dispatchPublishJob(jobId);
  return Response.json({ ok: true, result });
}
