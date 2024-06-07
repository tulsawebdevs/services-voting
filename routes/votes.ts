import express from "express";
import VotesService from '../services/votes';
import { validateRequest } from '../helpers';
import { PendingVote } from '../types/vote';
import { z } from "zod";

const router = express.Router();

/**
 * Request Validators
 */
const RecordRequest = z.object(  {
  recordId: z.coerce.number()
})
type RecordQuery = z.infer<typeof RecordRequest>

const PostRequest = z.object({
  query: RecordRequest,
  body: PendingVote
});

const DeleteRequest = z.object({
  query: RecordRequest
});

router.post("/", validateRequest(PostRequest), async (req, res) => {

  const { recordId } = req.validated.query as RecordQuery
  const validationResult = req.validated.body as PendingVote

  try{
    const vote = await VotesService.store(validationResult, recordId, req.user.userEmail);
    return res.status(201).json(vote);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.delete("/", validateRequest(DeleteRequest), async (req, res) => {
  const { recordId } = req.validated.query as RecordQuery
  try {
    const rowCount = await VotesService.destroy(recordId, req.user.userEmail);
    if (rowCount === 0) {
      return res.status(404).json({message: 'Vote not found'})
    }
    return res.status(204).end();
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

export default router;
