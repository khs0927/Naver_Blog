import { NextRequest } from 'next/server';
import { JobStatus, PostStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireWorkerSecret } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireWorkerSecret(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json();
  const job = await prisma.job.update({
    where: { id },
    data: { status: JobStatus.SUCCEEDED, lastError: null },
    include: { post: true }
  });

  await prisma.post.update({
    where: { id: job.postId },
    data: {
      status: body.status === 'published' ? PostStatus.PUBLISHED : PostStatus.DRAFTED,
      tistoryUrl: body.url || null,
      errorMessage: null
    }
  });

  await prisma.runLog.create({
    data: { jobId: id, level: 'info', message: 'Publish job completed', meta: body }
  });

  return Response.json({ ok: true });
}
