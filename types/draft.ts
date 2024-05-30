import { z } from 'zod'
const Draft = z.object({
	title: z.string().max(48),
	summary: z.string().max(255),
	description: z.string().max(2048),
	type: z.enum(['topic', 'project']),
	id: z.number().int().positive(),
	created: z.string(),
	updated: z.string().nullable(),
})

type Draft = z.infer<typeof Draft>

const PendingDraft = z.object({
	title: z.string().max(48),
	summary: z.string().max(255),
	description: z.string().max(2048),
	type: z.enum(['topic', 'project']),
})

type PendingDraft = z.infer<typeof PendingDraft>

const DraftUpdate = PendingDraft.partial()

type DraftUpdate = z.infer<typeof DraftUpdate>

export { Draft, PendingDraft, DraftUpdate }
