import {it, describe, expect} from 'vitest';
import { TEST_SERVER_URL } from "./global.setup";
import { resetDatabase } from '../database';

describe("Proposals API", () => {
  it('returns 404 on no proposals', async () => {
    await resetDatabase();
    const res = await fetch(`${TEST_SERVER_URL}/proposals`);
    expect(res.status).toBe(404);
  });

  it('store route', async() => {
    const res = await fetch(`${TEST_SERVER_URL}/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Proposal title',
        description: 'Proposal description',
        summary: 'Proposal summary of at least 30 chars',
        type: 'topic',
      })
    });

    expect(res.status).toBe(201);
  })
});
