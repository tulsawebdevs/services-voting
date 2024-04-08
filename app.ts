import express from "express";
import ProposalsRouter from "./routes/proposals";
import TopicsRouter from "./routes/topics";
const app = express();

app.use(express.json());

app.use("/proposals", ProposalsRouter);
app.use("/topics", TopicsRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
