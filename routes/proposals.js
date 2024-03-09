const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Paginated list of proposals" });
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

module.exports = router;
