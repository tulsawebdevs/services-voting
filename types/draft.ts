import { z } from 'zod'
const Draft = z.object({
	title: z.string().max(48).optional(),
	summary: z.string().max(255).optional(),
	description: z.string().max(2048).optional(),
	type: z.enum(['topic', 'project']).optional(),
	id: z.number().int().positive(),
	created: z.string(),
	updated: z.string().nullable().optional(),
})

type Draft = z.infer<typeof Draft>

const PendingDraft = z.object({
	title: z.string().max(48).optional().nullable(),
	summary: z.string().max(255).optional().nullable(),
	description: z.string().max(2048).optional().nullable(),
	type: z.enum(['topic', 'project']).optional().nullable(),
})

type PendingDraft = z.infer<typeof PendingDraft>

const DraftUpdate = PendingDraft.partial()

type DraftUpdate = z.infer<typeof DraftUpdate>

export { Draft, PendingDraft, DraftUpdate }
