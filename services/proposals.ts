import { getPool } from '../database';
import { SchemaValidationError, sql } from 'slonik';
import { Proposal, PendingProposal } from '../types/proposal';

async function index(): Promise<readonly Proposal[]> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const rows = await connection.any(
		sql.type(Proposal)`
		SELECT * FROM proposals;`)

		return rows;
	});
}

async function store(data: PendingProposal): Promise<Proposal> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const proposal = await connection.one(sql.type(Proposal)`
		INSERT INTO proposals (title, summary, description, type) 
		VALUES (${data.title}, ${data.summary}, ${data.description}, ${data.type}) 
		RETURNING *;`)

		return proposal;
	});
}

export default {
	index,
	store,
}
