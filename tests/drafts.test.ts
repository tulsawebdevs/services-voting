import { expect, describe, it } from "vitest";
import { TEST_SERVER_URL } from "./global.setup";
import {resetDatabase} from "../database";
import DraftsService from '../services/drafts';
import assertDatabaseHas from "./helpers/assertDatabaseHas";

describe('test suite works', () => {
  it("should hit health check", async () => {
    const res = await fetch(`${TEST_SERVER_URL}/health`);
    expect(res.status).toEqual(200);
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

describe('factory and count services', () => {
  it('should create and count drafts', async () => {
    await resetDatabase()
    const email = 'test@example.com';
    const customTitle = 'Custom Title';
    const draftData = DraftsService.factory({ title: customTitle });
    await DraftsService.store(draftData, email);
    const count = await DraftsService.count();
    expect(count).toBeGreaterThan(0);
    await assertDatabaseHas("drafts", { title: customTitle });
  });
});



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
