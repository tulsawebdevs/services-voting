import { getPool } from '../database';
import { sql} from 'slonik';
import {Vote, PendingVote, VoteResponse} from '../types/vote';
import { faker } from "@faker-js/faker";

interface StoreParams {
	data: PendingVote,
	recordId: number,
	email: string
}

interface DestroyParams {
	recordId: number,
	email: string
}

async function store({ data, recordId, email }: StoreParams): Promise<VoteResponse> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const newVote = await connection.one(sql.type(Vote)`
			INSERT INTO votes (voter_email, proposal_id, vote, comment)
			VALUES (${email}, ${recordId}, ${data.value}, ${data.comment ?? null})
			ON CONFLICT (voter_email, proposal_id) 
            DO UPDATE SET
				vote = EXCLUDED.vote,
				comment = EXCLUDED.comment
			RETURNING vote AS value, comment, id, created, updated, proposal_id, voter_email;`);
		const { voterEmail, proposalId, ...rest } = newVote;
		return rest;
	});
}


async function destroy({ recordId, email }: DestroyParams) {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const result = await connection.query(sql.unsafe`
			DELETE FROM votes 
			WHERE proposal_id = ${recordId} AND voter_email = ${email};`)
		return result.rowCount;
	});
}

async function count(): Promise<number> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const result = await connection.oneFirst(sql.unsafe`
        SELECT COUNT(*) FROM votes;`);
		return Number(result);
	});
}

function factory(params: Partial<PendingVote> = {}): PendingVote {
	const defaultVote = {
		value: faker.helpers.arrayElement([-2, -1, 0, 1, 2]),
		comment: faker.lorem.sentence({ min: 5, max: 10 }),
	};
	return { ...defaultVote, ...params } as PendingVote;
}

export default {
	store,
	destroy,
	count,
	factory
};