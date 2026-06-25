import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireWorkerSecret } from '@/lib/auth';
import { addMinutes } from '@/lib/dates';

export async function POST(req: NextRequest) {
  const unauthorized = requireWorkerSecret(req);
  if (unauthorized) return unauthorized;

  const now = new Date();
  const schedules = await prisma.schedule.findMany({
    where: {
      enabled: true,
      nextRunAt: { lte: now },
      OR: [{ remainingCount: null }, { remainingCount: { gt: 0 } }]
    },
    orderBy: { nextRunAt: 'asc' },
    take: 10
  });

  const created: { scheduleId: string; postId: string; jobId: string }[] = [];

  for (const schedule of schedules) {
    const topic = schedule.topicSeed || schedule.instruction;
    const title = topic.length > 80 ? topic.slice(0, 80) : topic;
    const post = await prisma.post.create({
      data: {
        title,
        topic,
        category: schedule.category,
        tags: schedule.tags,
        publishMode: schedule.publishMode,
        scheduledAt: now,
        jobs: { create: { runAfter: now } }
      },
      include: { jobs: true }
    });

    created.push({ scheduleId: schedule.id, postId: post.id, jobId: post.jobs[0].id });

    const nextRemaining = schedule.remainingCount === null ? null : Math.max(schedule.remainingCount - 1, 0);
    await prisma.schedule.update({
      where: { id: schedule.id },
      data: {
        remainingCount: nextRemaining,
        enabled: nextRemaining === 0 ? false : schedule.enabled,
        nextRunAt: addMinutes(schedule.nextRunAt, schedule.intervalMinutes)
      }
    });
  }

  return Response.json({ ok: true, created });
}
