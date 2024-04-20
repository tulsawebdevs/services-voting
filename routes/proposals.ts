import express from 'express';
import ProposalsService from '../services/proposals';
import { SchemaValidationError } from 'slonik';
import { formatQueryErrorResponse } from '../helpers';

const router = express.Router();

router.get("/", async (req, res) => {
  try{
    const proposals = await ProposalsService.index();
    return res.status(200).json(proposals);
  }catch(e){
    if (e instanceof SchemaValidationError) {
      return res.status(400)
        .json({message: 'Error fetching proposals: ' + formatQueryErrorResponse(e)})
    }

    return res.status(500).json({message: 'Server Error'})
  }
});

router.post("/", (req, res) => {
  res.status(201).json({ message: "Proposal created" });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `Proposal with ID ${id}` });
});

router.post("/:id", (req, res) => {
  const { id } = req.params;

  res.status(200).json({ message: `Proposal with ID ${id} updated` });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.status(204).json(); // No Content
});

export default router;
