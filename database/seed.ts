import { seedDatabase } from "../tests/helpers/seedDatabase";

async function main() {
  console.log('seeding...');

  const seedDb = seedDatabase();
  const proposals = await seedDb.addProposals(30);
  proposals.forEach((p) => seedDb.addVotesForProposal(p.id, { min: 0, max: 10 }))

  console.log('done seeding...');
}

main()
  .catch((error) => {
    console.error(error);
  });