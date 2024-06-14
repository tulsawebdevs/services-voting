import express from 'express';
import ProposalsService from '../services/proposals';
import { SchemaValidationError } from 'slonik';
import { NotFoundError, filterNullValues, formatQueryErrorResponse, validateRequest } from '../helpers';
import { PendingProposal, Proposal } from '../types/proposal';
import VotesRouter from "./votes";
import { z } from "zod";

const router = express.Router();

router.use("/votes", VotesRouter)

/**
 * Request Validators
 */
const IndexRequest = z.object({
  query: z.object({
    recordId: z.coerce.number().optional(),
    type: z.enum(["topic", "project"]).optional(),
    status: z.enum(["open", "closed"]).optional(),
    pagination: z.object({
      cursor: z.coerce.number().optional(),
      limit: z.coerce.number().optional()
    }).optional()
  })
})
type IndexQuery = z.infer<typeof IndexRequest>['query'];

const PostRequest = z.object({
  body: PendingProposal
});

router.get("/", validateRequest(IndexRequest), async (req, res) => {
  const {
    recordId,
    type,
    status,
    pagination
  } = req.validated.query as IndexQuery;
  const cursor = pagination?.cursor;
  const limit = pagination?.limit;
  try {
    if (recordId) {
      let proposal = await ProposalsService.show(recordId);
      proposal = filterNullValues(proposal) as Proposal
      return res.status(200).json(proposal);
    } else {
      let proposals = await ProposalsService.index(type, status, cursor, limit, req.user.userEmail);
      if (proposals.length === 0) {
        return res.status(404).json({ message: 'No proposals found' });
      }
      let nextCursor;
      if (limit && proposals.length === limit + 1) {
        proposals = proposals.slice(0, limit); // Remove the extra draft
        nextCursor = (cursor ?? 0) + limit;
      }
      proposals = proposals.map(filterNullValues) as Proposal[]
      const response = {
        limit: limit || proposals.length,
        proposals: proposals,
        cursor: nextCursor
      }
      return res.status(200).json(response);
    }
  } catch (e) {
    if (e instanceof SchemaValidationError) {
      return res.status(400)
        .json({ message: 'Error fetching proposals: ' + formatQueryErrorResponse(e) })
    } else if (e instanceof NotFoundError) {
      return res.status(404).json({ message: e.message })
    }

    console.log(e)
    return res.status(500).json({ message: 'Server Error' })
  }
});

router.post("/", validateRequest(PostRequest), async (req, res) => {
  const validationResult = req.validated.body as PendingProposal

  try {
    let proposal = await ProposalsService.store(validationResult, req.user.userFullName, req.user.userEmail);
    proposal = filterNullValues(proposal) as Proposal
    return res.status(201).json(proposal);
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: 'Server Error' })
  }
});

export default router;
