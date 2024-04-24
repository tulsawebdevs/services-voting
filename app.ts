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

// 404 handler
app.use((req, res, next) => {
  res.status(404).send("Page Not found");
})

export default app;
