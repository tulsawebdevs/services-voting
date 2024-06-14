import { it, describe, expect } from "vitest";
import { TEST_SERVER_URL } from "./global.setup";
import { resetDatabase } from "../database";
import {PendingProposal, Proposal} from "../types/proposal";
import { seedDatabase } from "./helpers/seedDatabase";
import { TEST_USER } from "../helpers";
import assertDatabaseHas from './helpers/assertDatabaseHas';
import ProposalsService from '../services/proposals';

const seedDb = seedDatabase();

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
