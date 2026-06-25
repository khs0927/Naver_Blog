import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { post: true }
  });

  return Response.json({ ok: true, jobs });
}
