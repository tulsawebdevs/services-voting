import { z } from 'zod'
import {PendingDraft} from "./draft";
const Vote = z.object({
	email: z.string().max(255),
	proposalId: z.number().int().positive(),
	value: z.number().min(-2).max(2).nullable(),
	comment: z.string().max(255),
	id: z.number().int().positive(),
	created: z.string(),
	updated: z.string().nullable(),
})

type Vote = z.infer<typeof Vote>

const PendingVote = z.object({
	value: z.number().min(-2).max(2).nullable(),
	comment: z.string().max(255).optional().nullable()
})

type PendingVote = z.infer<typeof PendingVote>

export { Vote, PendingVote }
