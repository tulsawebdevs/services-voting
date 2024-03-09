const express = require("express");
const app = express();

app.use(express.json());

app.use("/proposals", require("./routes/proposals"));
app.use("/topics", require("./routes/topics"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
