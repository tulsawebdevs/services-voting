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
