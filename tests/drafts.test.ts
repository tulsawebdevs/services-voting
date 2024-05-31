import { expect, describe, it } from "vitest";
import { TEST_SERVER_URL } from "./global.setup";
import {resetDatabase} from "../database";

describe('test suite works', () => {

  it("should hit health check", async () => {
    const res = await fetch(TEST_SERVER_URL);
    expect(res.status).toEqual(200);
    expect(await res.text()).toContain('Hello World');
  });
})

describe('smoke tests', () => {
  it('index route 404 on empty db', async () => {
    await resetDatabase();
    const res = await fetch(`${TEST_SERVER_URL}/drafts`);
    const data = await res.json();
    expect(res.status).toEqual(404);
  })

  it('store route', async () => {
    const res = await fetch(`${TEST_SERVER_URL}/drafts/`, {
      method: 'POST', 
      body: JSON.stringify({})
    });
    expect(res.status).toEqual(201);
  })
})



/*
TEST DRAFT
 */

//   res.status(200).json({
//     list: [
//       {
//         title: "Test Draft",
//         summary: "This is a test draft",
//         description: "A draft for testing",
//         type: "Topic",
//         id: "1",
//         created: "2024-05-12T21:40:26.157Z",
//         updated: "2024-05-12T21:40:26.157Z",
//       },
//     ],
//   });
// });
