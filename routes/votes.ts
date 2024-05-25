import express from "express";
import VotesService from '../services/votes';
import { SchemaValidationError } from 'slonik';
import { formatQueryErrorResponse, validateRequest } from '../helpers';
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
    const vote = await VotesService.store(validationResult, recordId, "johndoe@email.com");
    return res.status(201).json(vote);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.delete("/", validateRequest(DeleteRequest), async (req, res) => {
  const { recordId } = req.validated.query as RecordQuery
  try {
    const result = await VotesService.destroy(recordId);
    return res.status(200).json({count: result.rowCount, rows:result.rows});
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

export default router;
