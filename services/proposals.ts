import { getPool } from '../database';
import { sql } from 'slonik';
import {update as slonikUpdate} from 'slonik-utilities';
import { Proposal, PendingProposal, ProposalUpdate } from '../types/proposal';

async function index(): Promise<readonly Proposal[]> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const rows = await connection.any(
		sql.type(Proposal)`
		SELECT * FROM proposals ORDER BY id;`)

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

async function show(id: string): Promise<Proposal> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const proposal = await connection.maybeOne(sql.type(Proposal)`
		SELECT * FROM proposals WHERE id = ${id};`)

		if (!proposal) throw new Error('Proposal not found');
		return proposal;
	});
}

async function update(id: string, data: ProposalUpdate) {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		return await slonikUpdate(
			connection, 
			'proposals', 
			data, 
			{id: parseInt(id)}
		)

		/* 
		* Example of constructing update without slonik-utilities 
		*/
		// const updates = sql.join(
		// 	Object.entries(data).map(([column, value]) => {
		// 	return sql.fragment`${sql.identifier([column])} = ${value}`;
		// }), sql.fragment`, `);

		// return await connection.one(sql.type(Proposal)`
		// UPDATE proposals SET ${updates} WHERE id = ${id} RETURNING *;
		// `)
	});
}

export default {
	index,
	store,
	show,
	update,
}
