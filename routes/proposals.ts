import express from 'express';
import ProposalsService from '../services/proposals';
import { SchemaValidationError } from 'slonik';
import { formatQueryErrorResponse } from '../helpers';
import { PendingProposal, ProposalUpdate } from '../types/proposal';
import VotesRouter from "./votes"

const router = express.Router();

router.use("/votes", VotesRouter)

router.get("/", async (req, res) => {
  try{
    const proposals = await ProposalsService.index();
    return res.status(200).json(proposals);
  }catch(e){
    if (e instanceof SchemaValidationError) {
      return res.status(400)
        .json({message: 'Error fetching proposals: ' + formatQueryErrorResponse(e)})
    }

    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.post("/", async (req, res) => {
  const data = req.body;
  const validationResult = PendingProposal.safeParse(data);
  if(!validationResult.success){
    return res.status(422).json({message: 'Invalid data', error: validationResult.error})
  }

  try{
    const proposal = await ProposalsService.store(data);
    return res.status(201).json({ success: true, proposal: JSON.stringify(proposal)});
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.get("/:id", async (req, res) => {
  let { id } = req.params;
  try{
    const proposal = await ProposalsService.show(id);
    return res.status(200).json(proposal);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const validationResult = ProposalUpdate.safeParse(data);
  if(!validationResult.success){
    return res.status(422).json({message: 'Invalid data', error: validationResult.error})
  }

  try{
    const result = await ProposalsService.update(id, validationResult.data);
    res.status(200).json(result);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ProposalsService.destroy(id);
    return res.status(200).json({count: result.rowCount, rows:result.rows}); 
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

export default router;
