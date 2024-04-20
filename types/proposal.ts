import { z } from 'zod'
const Proposal = z.object({
	title: z.string().min(1).max(100),
	summary: z.string().min(10).max(255),
	description: z.string().min(10).max(1000),
	type: z.enum(['topic', 'project']),
	status: z.enum(['draft', 'rfc', 'open', 'closed']),
	id: z.number().int().positive(),
	created: z.number().transform(val => new Date(val)),
	updated: z.number().transform(val => new Date(val)).nullable(),
})

type Proposal = z.infer<typeof Proposal>

const PendingProposal = z.object({
	title: z.string().min(1).max(100),
	summary: z.string().min(10).max(255),
	description: z.string().min(1).max(1000),
	type: z.enum(['topic', 'project']),
})

type PendingProposal = z.infer<typeof PendingProposal>

const ProposalUpdate = z.object({
	title: z.string().min(1).max(100).optional(),
	summary: z.string().min(10).max(255).optional(),
	description: z.string().min(1).max(1000).optional(),
	type: z.enum(['topic', 'project']).optional(),
	status: z.enum(['draft', 'rfc', 'open', 'closed']).optional(),
})

type ProposalUpdate = z.infer<typeof ProposalUpdate>

export { Proposal, PendingProposal, ProposalUpdate }
