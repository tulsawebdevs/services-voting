import { z } from 'zod'

const DraftResponse = z.object({
	title: z.string().max(48).optional().nullable(),
	summary: z.string().max(255).optional().nullable(),
	description: z.string().max(2048).optional().nullable(),
	type: z.enum(['topic', 'project']).optional().nullable(),
	id: z.number().int().positive(),
	created: z.string(),
	updated: z.string(),
})

type DraftResponse = z.infer<typeof DraftResponse>

const Draft = DraftResponse.extend({
	voterEmail: z.string().max(255)
})

type Draft = z.infer<typeof Draft>

const PendingDraft = z.object({
	title: z.string().max(48).nullable(),
	summary: z.string().max(255).nullable(),
	description: z.string().max(2048).nullable(),
	type: z.enum(['topic', 'project']).nullable(),
})

type PendingDraft = z.infer<typeof PendingDraft>

const DraftUpdate = PendingDraft.partial()

type DraftUpdate = z.infer<typeof DraftUpdate>

const DraftBody = z.union([PendingDraft, DraftUpdate])

type DraftBody = z.infer<typeof DraftBody>

export { Draft, PendingDraft, DraftUpdate, DraftBody, DraftResponse }
