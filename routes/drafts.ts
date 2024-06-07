import express from "express";
import DraftsService from '../services/drafts';
import { SchemaValidationError } from 'slonik';
import {handleDraftUpdate, filterNullValues, formatQueryErrorResponse, validateRequest} from '../helpers';
import {PendingDraft, DraftUpdate, Draft} from '../types/draft';
import { z } from "zod";

const router = express.Router();

/**
 * Request Validators 
 */
const IndexRequest = z.object(  {
  query:z.object( {
    recordId: z.coerce.number().optional(),
    type: z.enum(["topic", "project"]).optional(),
    pagination: z.object({
      cursor: z.coerce.number().optional(),
      limit: z.coerce.number().optional()
    }).optional()
  })
})
type IndexQuery = z.infer<typeof IndexRequest>['query'];

const RecordRequest = z.object(  {
  recordId: z.coerce.number()
})
type RecordQuery = z.infer<typeof RecordRequest>

const PostRequest = z.object({
  body: DraftUpdate
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
    pagination
  } = req.validated.query as IndexQuery;
  const cursor = pagination?.cursor;
  const limit = pagination?.limit;
  try {
    if (recordId) {
      let draft = await DraftsService.show(recordId);
      draft = filterNullValues(draft) as Draft
      return res.status(200).json(draft);
    } else {
      let drafts = await DraftsService.index(req.user.userEmail, type, cursor, limit);
      if (drafts.length === 0) {
        return res.status(404).json({ message: 'No drafts found' });
      }
      drafts = drafts.map(filterNullValues) as Draft[]
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
    let draft = await DraftsService.store(validationResult, req.user.userEmail);
    draft = filterNullValues(draft) as Draft

    return res.status(201).json(draft);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.put("/", validateRequest(PutRequest), async (req, res) => {
  const { recordId } = req.validated.query as RecordQuery;
  const validationResult = req.validated.body as PendingDraft;
  await handleDraftUpdate(recordId, validationResult, res);
});

router.patch("/", validateRequest(PatchRequest), async (req, res) => {
  const { recordId } = req.validated.query as RecordQuery;
  const validationResult = req.validated.body as DraftUpdate;
  await handleDraftUpdate(recordId, validationResult, res);
});

router.delete("/", validateRequest(DeleteRequest), async (req, res) => {
  const { recordId } = req.validated.query as RecordQuery
  try {
    const result = await DraftsService.destroy(recordId);
    if (result.rowCount === 0) {
      return res.status(404).json({message: 'Draft not found'})
    }
    return res.status(204).end();
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

export default router;
