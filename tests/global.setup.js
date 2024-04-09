import { createServer } from "http";
import app from "../app";
let server;

export async function setup() {
  server = createServer(app);
  server.listen(3000);
}

export async function teardown() {
  server.close();
}
