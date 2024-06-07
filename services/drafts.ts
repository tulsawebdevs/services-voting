import { getPool } from '../database';
import { sql} from 'slonik';
import {update as slonikUpdate} from 'slonik-utilities';
import { Draft, PendingDraft, DraftUpdate } from '../types/draft';

async function index(email: string, type?: string, cursor?: number, limit?: number): Promise<readonly Draft[]> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const rows = await connection.any(
		sql.type(Draft)`
		SELECT id, created, updated, title, summary, description, type FROM drafts
		WHERE email = ${email}
	    ${type ? sql.fragment`AND type = ${type}` : sql.fragment``} 
        ORDER BY id OFFSET ${cursor ?? null} LIMIT ${limit ?? null};`)

		return rows;
	});
}

async function store(data: PendingDraft, email: string): Promise<Draft> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const draft = await connection.one(sql.type(Draft)`
		INSERT INTO drafts (title, summary, description, type, email) 
		VALUES (${data.title ?? null}, ${data.summary ?? null}, ${data.description ?? null}, ${data.type ?? null}, ${email}) 
		RETURNING id, created, updated, title, summary, description, type;`)

		return draft;
	});
}

async function show(id: number): Promise<Draft> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const draft = await connection.maybeOne(sql.type(Draft)`
		SELECT * FROM drafts WHERE id = ${id};`)

		if (!draft) throw new Error('Draft not found');
		return draft;
	});
}

async function update(id: number, data: DraftUpdate) {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		return await slonikUpdate(
			connection, 
			'drafts',
			data,
			{id}
		)
	});
}

async function destroy(id: number) {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		return await connection.query(sql.unsafe`
				DELETE FROM drafts WHERE id = ${id} RETURNING id, title;
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
