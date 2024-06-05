import express from 'express';
import ProposalsService from '../services/proposals';
import { SchemaValidationError } from 'slonik';
import { formatQueryErrorResponse, validateRequest } from '../helpers';
import { PendingProposal } from '../types/proposal';
import VotesRouter from "./votes";
import { z } from "zod";

const router = express.Router();

router.use("/votes", VotesRouter)

/**
 * Request Validators
 */
const IndexRequest = z.object(  {
  query:z.object( {
    recordId: z.coerce.number().optional(),
    type: z.enum(["topic", "project"]).optional(),
    status: z.enum(["open", "closed"]).optional(),
    cursor: z.coerce.number().optional(),
    limit: z.coerce.number().optional()
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
    cursor,
    limit
  } = req.validated.query as IndexQuery;
  try{
    if (recordId) {
      const proposal = await ProposalsService.show(recordId);
      return res.status(200).json(proposal);
    } else {
      const proposals = await ProposalsService.index(type, status, cursor, limit);
      if (proposals.length === 0) {
        return res.status(404).json({ message: 'No proposals found' });
      }
      const response = {
        limit: limit || proposals.length,
        proposals: proposals
      }
      return res.status(200).json(response);
    }
  }catch(e){
    if (e instanceof SchemaValidationError) {
      return res.status(400)
        .json({message: 'Error fetching proposals: ' + formatQueryErrorResponse(e)})
    }

    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.post("/", validateRequest(PostRequest), async (req, res) => {
  const validationResult = req.validated.body as PendingProposal

  try{
    const draft = await ProposalsService.store(validationResult, req.user.userFullName, req.user.userEmail);
    return res.status(201).json(draft);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

export default router;
