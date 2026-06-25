import { NextRequest } from 'next/server';
import { JobStatus, PostStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireWorkerSecret } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireWorkerSecret(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const message = body.error || 'Unknown error';

  const current = await prisma.job.findUnique({ where: { id }, include: { post: true } });
  if (!current) return Response.json({ error: 'Not found' }, { status: 404 });

  const shouldRetry = current.attempts < current.maxAttempts;
  await prisma.job.update({
    where: { id },
    data: {
      status: shouldRetry ? JobStatus.QUEUED : JobStatus.FAILED,
      lastError: message,
      runAfter: shouldRetry ? new Date(Date.now() + 10 * 60_000) : current.runAfter
    }
  });

  await prisma.post.update({
    where: { id: current.postId },
    data: {
      status: shouldRetry ? PostStatus.QUEUED : PostStatus.FAILED,
      errorMessage: message
    }
  });

  await prisma.runLog.create({
    data: { jobId: id, level: 'error', message, meta: body }
  });

  return Response.json({ ok: true, retry: shouldRetry });
}
