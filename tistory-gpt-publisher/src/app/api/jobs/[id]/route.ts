import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiKey, requireWorkerSecret } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(req) || requireWorkerSecret(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id }, include: { post: true } });
  if (!job) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ ok: true, job });
}
