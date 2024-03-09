const app = require("./app");

const port = parseInt(process.env.PORT || "3000");

app.listen(port, () => {
  console.log(`services-proposals now listening on port ${port}`);
});
