import 'dotenv/config';
import express from "express";
import ProposalsRouter from "./routes/proposals";
import TopicsRouter from "./routes/topics";
import DraftsRouter from "./routes/drafts";
import WinnerRouter from "./routes/winner"
import cors from 'cors';
import { logRequest, clerkAuth } from "./middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logRequest);
app.use(clerkAuth);

app.use("/proposals", ProposalsRouter);
app.use("/topics", TopicsRouter);
app.use("/drafts", DraftsRouter);
app.use("/winner", WinnerRouter);
app.use("/health", (req, res) => {
  res.status(200).json({ message: "Ok" });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: `route ${req.url} does not exist` });
})

export default app;
