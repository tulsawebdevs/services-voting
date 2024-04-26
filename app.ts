import express from "express";
import ProposalsRouter from "./routes/proposals";
import TopicsRouter from "./routes/topics";
import cors from 'cors';
const app = express();

const corsOptions = {
  origin: ['https://tulsawebdevs.org', 'https://www.tulsawebdevs.org']
}

app.use(cors(corsOptions))
app.use(express.json());

app.use("/proposals", ProposalsRouter);
app.use("/topics", TopicsRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({error: `route ${req.url} does not exist`});
})

export default app;
