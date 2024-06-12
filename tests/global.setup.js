import 'dotenv/config'
import { createServer } from "http";
import app from "../app";
let server;

export const TEST_SERVER_URL = `${process.env.TEST_SERVER_HOST}:${process.env.TEST_SERVER_PORT}`

export async function setup() {
  console.log(`Setting up the test server on port: ${process.env.TEST_SERVER_PORT}`)
  server = createServer(app);
  server.listen(process.env.TEST_SERVER_PORT);
}

export async function teardown() {
  server.close();
}
