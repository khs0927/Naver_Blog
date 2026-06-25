import { NextRequest } from 'next/server';
import { JobStatus, PostStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireWorkerSecret } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const unauthorized = requireWorkerSecret(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => ({}));
  const requestedJobId = body.jobId as string | undefined;

  const job = requestedJobId
    ? await prisma.job.findUnique({ where: { id: requestedJobId }, include: { post: true } })
    : await prisma.job.findFirst({
        where: { status: JobStatus.QUEUED, runAfter: { lte: new Date() } },
        orderBy: { runAfter: 'asc' },
        include: { post: true }
      });

  if (!job || job.status !== JobStatus.QUEUED) {
    return Response.json({ ok: true, job: null });
  }

  const updated = await prisma.job.update({
    where: { id: job.id },
    data: { status: JobStatus.RUNNING, lockedAt: new Date(), attempts: { increment: 1 } },
    include: { post: true }
  });

  await prisma.post.update({ where: { id: updated.postId }, data: { status: PostStatus.RUNNING } });

  return Response.json({ ok: true, job: updated });
}
