import { expect, describe, it } from "vitest";
import { TEST_SERVER_URL } from "./global.setup";

describe('test suite works', () => {
  it("should return all proposals", async () => {
    const res = await fetch(TEST_SERVER_URL);
    const data = await res.json();
    expect(res.status).toEqual(200);
    // expect(data).toEqual({ message: "Paginated list of proposals" });
  });
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

