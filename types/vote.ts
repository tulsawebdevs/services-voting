import { z } from 'zod'

const VoteResponse = z.object({
	id: z.number().int().positive(),
	created: z.string(),
	updated: z.string(),
	value: z.number().min(-2).max(2).nullable(),
	comment: z.string().max(255).optional().nullable()
})

type VoteResponse = z.infer<typeof VoteResponse>

const Vote = VoteResponse.extend({
	voterEmail: z.string().max(255),
	proposalId: z.number().int().positive(),
})

type Vote = z.infer<typeof Vote>

const PendingVote = z.object({
	value: z.number().min(-2).max(2).nullable(),
	comment: z.string().max(255).optional().nullable()
})

type PendingVote = z.infer<typeof PendingVote>

export { Vote, PendingVote, VoteResponse }
