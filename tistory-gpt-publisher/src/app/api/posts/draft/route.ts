import { NextRequest } from 'next/server';
import { PublishMode } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/auth';
import { createDraftSchema } from '@/lib/schemas';
import { addMinutes } from '@/lib/dates';
import { dispatchPublishJob } from '@/lib/github';

function toPublishMode(mode: string): PublishMode {
  if (mode === 'public') return PublishMode.PUBLIC;
  if (mode === 'draft') return PublishMode.DRAFT;
  return PublishMode.PRIVATE;
}

export async function POST(req: NextRequest) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const input = createDraftSchema.parse(await req.json());
  const count = input.count ?? 1;
  const interval = input.intervalMinutes ?? 5;
  const startAt = input.scheduledAt ? new Date(input.scheduledAt) : new Date();
  const jobs: { jobId: string; postId: string; runAfter: string }[] = [];

  for (let i = 0; i < count; i++) {
    const runAfter = count === 1 ? startAt : addMinutes(startAt, interval * i);
    const topicSuffix = count > 1 ? ` (${i + 1}/${count})` : '';
    const title = input.title || input.topic || input.instruction || `자동 포스팅${topicSuffix}`;

    const post = await prisma.post.create({
      data: {
        title: `${title}${topicSuffix}`,
        topic: input.topic || input.instruction || null,
        bodyMarkdown: input.bodyMarkdown || null,
        category: input.category || process.env.TISTORY_DEFAULT_CATEGORY || null,
        tags: input.tags,
        publishMode: toPublishMode(input.publishMode),
        scheduledAt: runAfter,
        jobs: {
          create: {
            runAfter
          }
        }
      },
      include: { jobs: true }
    });

    const job = post.jobs[0];
    jobs.push({ jobId: job.id, postId: post.id, runAfter: runAfter.toISOString() });

    if (input.runNow && count === 1) {
      await dispatchPublishJob(job.id);
    }
  }

  return Response.json({ ok: true, jobs });
}
