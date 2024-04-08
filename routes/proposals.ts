import express from 'express';
import ProposalsService from '../services/proposals';
import { getPool } from '../database';

const router = express.Router();

router.get("/", async (req, res) => {
  const proposals = ProposalsService.index();
  res.status(200).json(proposals);
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
