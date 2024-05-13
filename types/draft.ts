import { z } from 'zod'
const Draft = z.object({
	title: z.string().min(1).max(100),
	summary: z.string().min(10).max(255),
	description: z.string().min(10).max(1000),
	type: z.enum(['topic', 'project']),
	id: z.number().int().positive(),
	created: z.number().transform(val => new Date(val)),
	updated: z.number().transform(val => new Date(val)).nullable(),
})

type Draft = z.infer<typeof Draft>

const PendingDraft = z.object({
	title: z.string().min(1).max(100),
	summary: z.string().min(10).max(255),
	description: z.string().min(1).max(1000),
	type: z.enum(['topic', 'project']),
})

type PendingDraft = z.infer<typeof PendingDraft>

const DraftUpdate = z.object({
	title: z.string().min(1).max(100).optional(),
	summary: z.string().min(10).max(255).optional(),
	description: z.string().min(1).max(1000).optional(),
	type: z.enum(['topic', 'project']).optional(),
})

type DraftUpdate = z.infer<typeof DraftUpdate>

export { Draft, PendingDraft, DraftUpdate }
