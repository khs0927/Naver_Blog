import { NextRequest } from 'next/server';
import { PublishMode } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/auth';
import { scheduleSchema } from '@/lib/schemas';

function toPublishMode(mode: string): PublishMode {
  if (mode === 'public') return PublishMode.PUBLIC;
  if (mode === 'draft') return PublishMode.DRAFT;
  return PublishMode.PRIVATE;
}

export async function POST(req: NextRequest) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const input = scheduleSchema.parse(await req.json());
  const schedule = await prisma.schedule.create({
    data: {
      instruction: input.instruction,
      topicSeed: input.topicSeed,
      category: input.category,
      tags: input.tags,
      publishMode: toPublishMode(input.publishMode),
      intervalMinutes: input.intervalMinutes,
      remainingCount: input.count,
      nextRunAt: input.firstRunAt ? new Date(input.firstRunAt) : new Date()
    }
  });

  return Response.json({ ok: true, schedule });
}

export async function GET(req: NextRequest) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const schedules = await prisma.schedule.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  return Response.json({ ok: true, schedules });
}
