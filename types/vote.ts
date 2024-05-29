import { z } from 'zod'
import {PendingDraft} from "./draft";
const Vote = z.object({
	email: z.string().max(255),
	proposalId: z.number().int().positive(),
	value: z.enum(["-2", "-1", "0", "1", "2"]),
	comment: z.string().max(255),
	id: z.number().int().positive(),
	created: z.number().transform(val => new Date(val)),
	updated: z.number().transform(val => new Date(val)).nullable(),
})

type Vote = z.infer<typeof Vote>

const PendingVote = z.object({
	value: z.enum(["-2", "-1", "0", "1", "2"]),
	comment: z.string().max(255)
})

type PendingVote = z.infer<typeof PendingVote>

export { Vote, PendingVote }
