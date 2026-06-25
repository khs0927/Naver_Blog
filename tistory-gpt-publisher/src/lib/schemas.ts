import { z } from 'zod';

export const publishModeSchema = z.enum(['private', 'public', 'draft']).default('private');

export const createDraftSchema = z.object({
  instruction: z.string().optional(),
  topic: z.string().optional(),
  title: z.string().optional(),
  bodyMarkdown: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  publishMode: publishModeSchema,
  runNow: z.boolean().default(true),
  intervalMinutes: z.number().int().min(5).max(1440).optional(),
  count: z.number().int().min(1).max(20).default(1),
  scheduledAt: z.string().datetime().optional()
}).refine((v) => v.bodyMarkdown || v.title || v.topic || v.instruction, {
  message: 'bodyMarkdown, title, topic, instruction 중 하나는 필요합니다.'
});

export const scheduleSchema = z.object({
  instruction: z.string(),
  topicSeed: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  publishMode: publishModeSchema,
  intervalMinutes: z.number().int().min(5).max(43200).default(1440),
  count: z.number().int().min(1).max(365).optional(),
  firstRunAt: z.string().datetime().optional()
});

export type CreateDraftInput = z.infer<typeof createDraftSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
