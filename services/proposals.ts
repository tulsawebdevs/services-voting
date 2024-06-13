import { getPool } from '../database';
import { sql } from 'slonik';
import { update as slonikUpdate } from 'slonik-utilities';
import { Proposal, ProposalState, PendingProposal, ProposalUpdate } from '../types/proposal';
import { NotFoundError } from '../helpers';

async function index(
	type?: string,
	status?: string,
	cursor?: number,
	limit?: number,
	userEmail?: string
): Promise<readonly ProposalState[]> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const adjustedLimit = limit ? limit + 1 : null;
		const whereType = type ? sql.fragment`
			WHERE p.type = ${type}` : sql.fragment``;

		const whereStatus = status ? sql.fragment`
			${type ? sql.fragment`AND` : sql.fragment`WHERE`} 
			p.status = ${status}` : sql.fragment``;

		const userVote = sql.fragment`
			CASE
				WHEN uv.vote IS NOT NULL 
				THEN json_build_object('value', uv.vote, 'comment', uv.comment)
				ELSE NULL
			END AS "userVote"`;

		const results = sql.fragment`
			json_agg(
					json_build_object('value', v.vote, 'comment', v.comment)
				) FILTER (WHERE v.vote IS NOT NULL) as results`;

		const whereUserEmail = userEmail ? sql.fragment`= ${userEmail}` : sql.fragment`is NULL`;

		const rows = await connection.any(sql.type(ProposalState)`
        SELECT 
            p.id, p.created, p.updated, p.title, p.summary, p.description, p.type,
						p.status, p.author_name AS "authorName", ${userVote}, ${results}
        FROM proposals AS p
        LEFT JOIN votes AS v ON v.proposal_id = p.id
				LEFT JOIN LATERAL (
						SELECT vote, comment, voter_email
						FROM votes
						WHERE proposal_id = p.id AND voter_email ${whereUserEmail}
						LIMIT 1
				) AS uv ON true
        ${whereType}
        ${whereStatus}
        GROUP BY p.id, uv.vote, uv.comment
        ORDER BY p.id 
        OFFSET ${cursor ?? null} 
        LIMIT ${adjustedLimit};`);

		const filteredRows = rows.map(row => {
			if (row.status === 'open' || !row.results) {
				return { ...row, results: [] }
			}
			return row;
		});

		return filteredRows;
	});
}

async function store(data: PendingProposal, author: string, email: string): Promise<Proposal> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const proposal = await connection.one(sql.type(Proposal)`
		INSERT INTO proposals (title, summary, description, type, author_name, voter_email) 
		VALUES (${data.title}, ${data.summary}, ${data.description ?? null}, ${data.type}, ${author}, ${email}) 
		RETURNING author_name AS "authorName", status, title, summary, description, type, id, created, updated;`)

		return proposal;
	});
}

async function show(id: number): Promise<Proposal> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const proposal = await connection.maybeOne(sql.type(Proposal)`
		SELECT * FROM proposals WHERE id = ${id};`)

		if (!proposal) throw new NotFoundError('Proposal not found');

		return proposal;
	});
}

async function update(id: number, data: ProposalUpdate) {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		return await slonikUpdate(
			connection,
			'proposals',
			data,
			{ id }
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

async function destroy(id: number) {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		return await connection.query(sql.unsafe`
				DELETE FROM proposals WHERE id = ${id} RETURNING id, title;
		`)
	});
}

export default {
	index,
	store,
	show,
	update,
	destroy,
}
