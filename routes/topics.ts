import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
  const cursor = req.query.cursor || "start";
  const limit = req.query.limit || 10;

  res.status(200).json({
    list: [
      {
        name: "Fred Flintstone",
        email: "fred.flinstone@quarry.com",
        topic: "The future of stone age automobiles",
        summary: "It's time to put our feet down and move forward",
        category: "talk",
      },
    ],
  });
});

export default router;
