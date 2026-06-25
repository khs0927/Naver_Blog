import { NextRequest } from 'next/server';
import { JobStatus, PostStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/auth';
import { dispatchPublishJob } from '@/lib/github';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const job = await prisma.job.update({
    where: { id },
    data: { status: JobStatus.QUEUED, runAfter: new Date(), lastError: null },
    include: { post: true }
  });
  await prisma.post.update({ where: { id: job.postId }, data: { status: PostStatus.QUEUED, errorMessage: null } });
  await dispatchPublishJob(id);

  return Response.json({ ok: true, jobId: id });
}
