const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/topics", (req, res) => {
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

app.listen(port, () => {
  console.log(`services-proposals now listening on port ${port}`);
});
