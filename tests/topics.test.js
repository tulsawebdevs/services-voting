import { test, expect, beforeAll, afterAll } from "vitest";
import fetch from "node-fetch";
import { createServer } from "http";
import app from "../app";

let server;
beforeAll(() => {
  server = createServer(app);
  server.listen(3000);
});

afterAll(() => {
  server.close();
});

test("GET /topics", async ({ expect }) => {
  const response = await fetch("http://localhost:3000/topics");
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data).toEqual({
    list: [
      {
        name: expect.any(String),
        email: expect.any(String),
        topic: expect.any(String),
        summary: expect.any(String),
        category: expect.any(String),
      },
    ],
  });
});
