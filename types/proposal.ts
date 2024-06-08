import { z } from 'zod'

const Proposal = z.object({
	id: z.number().int().positive(),
	created: z.string(),
	updated: z.string().nullable(),
	title: z.string().min(8).max(48),
	summary: z.string().min(30).max(255),
	description: z.string().max(2048),
	type: z.enum(['topic', 'project']),
	status: z.enum(['open', 'closed']),
	author_name: z.string().min(4),
})

type Proposal = z.infer<typeof Proposal>

const ProposalState = Proposal.extend({
	user_vote: z.object({
		value: z.string(),
		comment: z.string(),
	}).optional(),
	results: z.array(
		z.object({
			value: z.string(),
			comment: z.string(),
		})
	).optional(),
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

export { Proposal, ProposalState, PendingProposal, ProposalUpdate }
