import { faker } from "@faker-js/faker";
import { PendingProposal, Proposal } from "../../types/proposal";
import ProposalService from "../../services/proposals";
import VotesService from "../../services/votes";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
};

export function createUsers(n: number): User[] {
  const activeUsers = Array.from({ length: n }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });

    return { firstName, lastName, email, displayName: faker.internet.userName({ firstName }) };
  });

  return activeUsers;
}

type SeedOptions = {
  numUsers?: number;
  numAuthors?: number;
  seed?: number;
};

export function seedDatabase({ numUsers = 50, numAuthors = 5, seed = 1 }: SeedOptions = {}) {
  faker.seed(seed);

  const users = createUsers(numUsers);
  const authors = createUsers(numAuthors);

  /****************************************
   * PROPOSALS
   ****************************************/
  async function addProposals(numProposals: number = 1) {
    const proposals: Proposal[] = [];

    for (let i = 0; i < numProposals; i += 1) {
      const newProposal = await PendingProposal.parseAsync(ProposalService.factory());

      const author = faker.helpers.arrayElement(authors);

      const proposal = await ProposalService.store(newProposal, author.displayName, author.email);

      proposals.push(proposal);
    }

    return proposals;
  }

  /****************************************
   * VOTES
   ****************************************/
  async function addVotesForProposal(
    proposalId: number,
    numVotes: number | { min?: number, max?: number } = { min: 0, max: 10 }
  ) {
    const totalVotes = faker.number.int(numVotes);
    const shuffledUsers = faker.helpers.shuffle(users)

    for (let i = 0; i < totalVotes; i += 1) {
      const email = shuffledUsers[i].email;

      await VotesService.store(
        VotesService.factory(),
        proposalId,
        email
      )
    }
  }

  async function addUserVote(proposalId: number, userEmail?: string) {
    userEmail = userEmail || (faker.helpers.arrayElement(users)).email;

    await VotesService.store(
      VotesService.factory(),
      proposalId,
      userEmail
    )
  }

  async function addPositiveVote(proposalId: number, userEmail?: string) {
    userEmail = userEmail || (faker.helpers.arrayElement(users)).email;

    await VotesService.store(
      VotesService.factory({value: 2}),
      proposalId,
      userEmail
    )
  }

  async function addNegativeVote(proposalId: number, userEmail?: string) {
    userEmail = userEmail || (faker.helpers.arrayElement(users)).email;

    await VotesService.store(
      VotesService.factory({value: -2}),
      proposalId,
      userEmail
    )
  }

  return {
    addProposals,
    addVotesForProposal,
    addUserVote,
    users,
    authors,
    addPositiveVote,
    addNegativeVote
  };
}