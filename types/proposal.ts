import { z } from 'zod'
import {PendingDraft} from "./draft";
const Proposal = z.object({
	title: z.string().min(8).max(48),
	summary: z.string().min(30).max(255),
	description: z.string().max(2048),
	type: z.enum(['topic', 'project']),
	author: z.string().max(50),
	status: z.enum(['open', 'closed']),
	id: z.number().int().positive(),
	created: z.number().transform(val => new Date(val)),
	updated: z.number().transform(val => new Date(val)).nullable(),
})

type Proposal = z.infer<typeof Proposal>

const PendingProposal = z.object({
	title: z.string().min(8).max(48),
	summary: z.string().min(30).max(255),
	description: z.string().max(2048),
	type: z.enum(['topic', 'project']),
})

type PendingProposal = z.infer<typeof PendingProposal>

const ProposalUpdate = PendingProposal.partial()

type ProposalUpdate = z.infer<typeof ProposalUpdate>

export { Proposal, PendingProposal, ProposalUpdate }
