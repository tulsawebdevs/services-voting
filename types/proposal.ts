import { z } from 'zod'

const ProposalResponse = z.object({
	id: z.number().int().positive(),
	created: z.number(),
	updated: z.number(),
	title: z.string().min(8).max(48),
	summary: z.string().min(30).max(255),
	description: z.string().max(2048),
	type: z.enum(['topic', 'project']),
	status: z.enum(['open', 'closed']),
	authorName: z.string().min(4),
})

type ProposalResponse = z.infer<typeof ProposalResponse>

const Proposal = ProposalResponse.extend({
	voterEmail: z.string().max(255)
})

type Proposal = z.infer<typeof Proposal>

const ProposalState = ProposalResponse.extend({
	userVote: z.object({
		value: z.number().min(-2).max(2).nullable(),
		comment: z.string(),
	}).optional().nullable(),
	results: z.array(
		z.object({
			value: z.number().min(-2).max(2).nullable(),
			comment: z.string(),
		})
	).optional().nullable(),
})

type ProposalState = z.infer<typeof ProposalState>

const PendingProposal = z.object({
	title: z.string().min(8).max(48),
	summary: z.string().min(30).max(255),
	description: z.string().max(2048).optional().nullable(),
	type: z.enum(['topic', 'project']),
})

type PendingProposal = z.infer<typeof PendingProposal>

const ProposalUpdate = PendingProposal.partial()

type ProposalUpdate = z.infer<typeof ProposalUpdate>

export { Proposal, ProposalState, PendingProposal, ProposalUpdate, ProposalResponse }
