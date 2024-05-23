import express from "express";
import DraftsService from '../services/drafts';
import { SchemaValidationError } from 'slonik';
import { formatQueryErrorResponse, validateRequest } from '../helpers';
import { PendingDraft, DraftUpdate } from '../types/draft';
import { z } from "zod";

const router = express.Router();

/**
 * Request Validators 
 */
const IndexRequest = z.object(  {
  query:z.object( {
    recordId: z.coerce.number().optional(),
    type: z.enum(["topic", "project"]).optional(),
    cursor: z.coerce.number().optional(),
    limit: z.coerce.number().optional()
  })
})
type IndexQuery = z.infer<typeof IndexRequest>['query'];

const RecordRequest = z.object(  {
  recordId: z.coerce.number()
})
type RecordQuery = z.infer<typeof RecordRequest>

const PostRequest = z.object({
  body: PendingDraft
});

const PutRequest = z.object({
  query: RecordRequest,
  body: PendingDraft
});

const PatchRequest = z.object({
  query: RecordRequest,
  body: DraftUpdate
});

const DeleteRequest = z.object({
  query: RecordRequest
});

router.get("/", validateRequest(IndexRequest), async (req, res) => {
  const {
    recordId,
    type,
    cursor,
    limit
  } = req.validated.query as IndexQuery;

  try {
    if (recordId) {
      const draft = await DraftsService.show(recordId);
      return res.status(200).json(draft);
    } else {
      const drafts = await DraftsService.index(type, cursor, limit);
      const response = {
        limit: limit || drafts.length,
        drafts: drafts
      }
      return res.status(200).json(response);
    }
  }catch(e){
    if (e instanceof SchemaValidationError) {
      return res.status(400)
        .json({message: 'Error fetching drafts: ' + formatQueryErrorResponse(e)})
    }

    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.post("/", validateRequest(PostRequest), async (req, res) => {
  const validationResult = req.validated.body as PendingDraft

  try{
    const draft = await DraftsService.store(validationResult);
    return res.status(201).json(draft);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.put("/", validateRequest(PutRequest), async (req, res) => {
  const { recordId } = req.validated.query as RecordQuery;
  try{
    const result = await DraftsService.update(recordId, req.validated.body as PendingDraft);
    res.status(200).json(result);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.patch("/", validateRequest(PatchRequest), async (req, res) => {
  const { recordId } = req.validated.query as RecordQuery;
  const validationResult = req.validated.body as DraftUpdate;
  try{
    const result = await DraftsService.update(recordId, validationResult);
    res.status(200).json(result);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.delete("/", validateRequest(DeleteRequest), async (req, res) => {
  const { recordId } = req.validated.query as RecordQuery
  try {
    const result = await DraftsService.destroy(recordId);
    return res.status(200).json({count: result.rowCount, rows:result.rows});
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

export default router;
