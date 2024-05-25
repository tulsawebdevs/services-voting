import { getPool } from '../database';
import { sql} from 'slonik';
import { Vote, PendingVote } from '../types/vote';

async function store(data: PendingVote, proposalId: number, email: string): Promise<Vote> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		console.log("data.value: ", data.value)
		const newVote = await connection.one(sql.type(Vote)`
			INSERT INTO votes (voter_email, proposal_id, vote, comment)
			VALUES (${email}, ${proposalId}, ${data.value}, ${data.comment})
			ON CONFLICT (voter_email, proposal_id) 
            DO UPDATE SET
				vote = EXCLUDED.vote,
				comment = EXCLUDED.comment
			RETURNING vote, comment, id, created, updated;`);
		return newVote;
	});
}


async function destroy(proposalId: number, email: string) {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		return await connection.query(sql.unsafe`
			DELETE FROM votes 
			WHERE proposal_id = ${proposalId} AND voter_email = ${email};`)
	});
}

export default {
	store,
	destroy,
}
