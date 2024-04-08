import app from "./app";
import { createPool } from "slonik";

//TODO - Create main function that calls init function for database, have server connect to db, then start listener
const port = parseInt(process.env.PORT || "3000");

async function main() {
app.listen(port, () => {
  console.log(`services-proposals now listening on port ${port}`);
});
}

main();
