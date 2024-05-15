import express from 'express';
import DraftsService from '../services/drafts';
import { SchemaValidationError } from 'slonik';
import { formatQueryErrorResponse } from '../helpers';
import { PendingDraft, DraftUpdate } from '../types/draft';
import type { Draft } from '../types/draft';

const router = express.Router();

interface IndexQueryParams  {
  recordId?: Draft["id"]
  type?: Draft["type"]
  cursor?: number
  limit?: number
}

interface ActionQueryParams {
  recordId: Draft["id"]
}

router.get("/", async (req, res) => {
  const { recordId } = req.query as unknown as IndexQueryParams;
  try {
    if (recordId) {
      const draft = await DraftsService.show(recordId);
      return res.status(200).json(draft);
    } else {
      const drafts = await DraftsService.index();
      return res.status(200).json(drafts);
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

router.post("/", async (req, res) => {
  const data = req.body;
  const validationResult = PendingDraft.safeParse(data);
  if(!validationResult.success){
    return res.status(422).json({message: 'Invalid data', error: validationResult.error})
  }

  try{
    const draft = await DraftsService.store(data);
    return res.status(201).json(draft);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.put("/", async (req, res) => {
  const { recordId } = req.query as unknown as ActionQueryParams;
  const data = req.body;
  const validationResult = PendingDraft.safeParse(data);
  if(!validationResult.success){
    return res.status(422).json({message: 'Invalid data', error: validationResult.error})
  }

  try{
    const result = await DraftsService.update(recordId, validationResult.data);
    res.status(200).json(result);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.patch("/", async (req, res) => {
  const { recordId } = req.query as unknown as ActionQueryParams;
  const data = req.body;
  const validationResult = DraftUpdate.safeParse(data);
  if(!validationResult.success){
    return res.status(422).json({message: 'Invalid data', error: validationResult.error})
  }

  try{
    const result = await DraftsService.update(recordId, validationResult.data);
    res.status(200).json(result);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.delete("/", async (req, res) => {
  const { recordId } = req.query as unknown as ActionQueryParams;
  try {
    const result = await DraftsService.destroy(recordId);
    return res.status(200).json({count: result.rowCount, rows:result.rows}); 
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

export default router;
