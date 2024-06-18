import { it, describe, expect } from "vitest";
import { TEST_SERVER_URL } from "./global.setup";
import { resetDatabase } from "../database";
import {Proposal} from "../types/proposal";
import { seedDatabase } from "./helpers/seedDatabase";
import { TEST_USER } from "../helpers";
import assertDatabaseHas from './helpers/assertDatabaseHas';
import DraftsService from "../services/drafts";

const seedDb = seedDatabase();


describe('test suite works', () => {
  it("should hit health check", async () => {
    const res = await fetch(`${TEST_SERVER_URL}/health`);
    expect(res.status).toEqual(200);
  });
})

/****************************************
 * PROPOSALS
 ****************************************/

describe("Proposals API", () => {
  it("returns 404 on no proposals", async () => {
    await resetDatabase();
    const res = await fetch(`${TEST_SERVER_URL}/proposals`);
    expect(res.status).toBe(404);
  });

  it("store route", async () => {
    const res = await fetch(`${TEST_SERVER_URL}/proposals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Proposal title",
        description: "Proposal description",
        summary: "Proposal summary of at least 30 chars",
        type: "topic",
      }),
    });

    expect(res.status).toBe(201);
  });

  describe("Get One Proposal", () => {
    it('returns 404 on no proposal', async () => {
      await resetDatabase();
      const res = await fetch(`${TEST_SERVER_URL}/proposals?recordId=1`, {
        method: "GET",
      });

      expect(res.status).toBe(404);
    })

    it('returns one proposal', async () => {
      await resetDatabase();
      const proposals = await seedDb.addProposals(1);
      const [proposal] = proposals;

      const res = await fetch(`${TEST_SERVER_URL}/proposals?recordId=${proposal.id}`, {
        method: "GET",
      });

      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.id).toEqual(proposal.id);
    });
  });

  it("has no user vote", async () => {
    await resetDatabase();
    await seedDb.addProposals(3);

    const res = await fetch(`${TEST_SERVER_URL}/proposals?pagination[limit]=10`, {
      method: "GET",
    });

    expect(res.status).toBe(200);

    const data = await res.json();
    const { limit, proposals } = data;
    expect(limit).toEqual(10);


    proposals.forEach((p: Proposal) => {
      expect(p).toHaveProperty("results");
      expect(p).not.toHaveProperty("userVote");
    });
  });

  describe("has user vote", async () => {
    it("votes for proposal", async () => {
      // start fresh for user votes
      await resetDatabase();

      // Add two proposals
      const proposals = await seedDb.addProposals(1);
      const proposal = proposals[0];

      const res = await fetch(`${TEST_SERVER_URL}/proposals/votes?recordId=${proposal.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: 1,
          comment: "I like this proposal",
        }),
      });

      expect(res.status).toBe(201);
    });

    it("has proposals with user vote", async () => {
      await resetDatabase();
      const [proposal] = await seedDb.addProposals(1);
      await seedDb.addUserVote(proposal.id);
      await seedDb.addUserVote(proposal.id, TEST_USER.userEmail);

      const res = await fetch(
        `${TEST_SERVER_URL}/proposals?pagination[limit]=10`,
        {
          method: "GET",
        }
      );

      expect(res.status).toBe(200);

      const data = await res.json();
      const { limit, proposals } = data;

      expect(limit).toEqual(10);

      const foundProposal = proposals.find((p: Proposal) => p.id === proposal.id);

      expect(foundProposal).toBeDefined();
      expect(foundProposal).toHaveProperty("results");
      expect(foundProposal).toHaveProperty("userVote");
    });
  });

  describe('assertDatabaseHas helper', () => {
    it('should store a proposal and verify it exists in the database', async () => {
      await resetDatabase();
      const proposals = await seedDb.addProposals(1);
      const [proposalData] = proposals;
      await assertDatabaseHas('proposals', {
        title: proposalData.title,
        summary: proposalData.summary,
        description: proposalData.description,
        type: proposalData.type
      });
    });
  });
});

/****************************************
 * DRAFTS
 ****************************************/

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

/****************************************
 * WINNER
 ****************************************/

describe("winner endpoint", () => {
  it("should return leading proposal and mark closed", async () => {
    await resetDatabase();
    const proposals = await seedDb.addProposals(2);
    const winningProposal = proposals[0];
    await seedDb.addUserVote(winningProposal.id, undefined, 2);
    await seedDb.addUserVote(proposals[1].id, undefined, -2)
    const res = await fetch(`${TEST_SERVER_URL}/winner`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toEqual(winningProposal.id);
    expect(data.status).toBe('closed');
  })
})

describe("winner endpoint - tied proposals", () => {
  it("should return a random winner in case of tie", async () => {
    await resetDatabase();
    const proposals = await seedDb.addProposals(3);
    for (const proposal of proposals) {
      await seedDb.addUserVote(proposal.id, undefined, 2)
    }
    const res = await fetch(`${TEST_SERVER_URL}/winner`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('closed');
    const remainingProposals = proposals.filter(p => p.id !== data.id);
    for (const proposal of remainingProposals) {
      expect(proposal.status).toBe('open');
    }
  })
})
