import { getPool } from '../database';
import { sql} from 'slonik';
import {update as slonikUpdate} from 'slonik-utilities';
import {Draft, DraftBody, DraftUpdate, PendingDraft} from '../types/draft';
import {filterNullValues} from "../helpers";
import {number} from "zod";
import { faker } from "@faker-js/faker";

async function index(email: string, type?: string, cursor?: number, limit?: number): Promise<readonly Draft[]> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const adjustedLimit = limit ? limit + 1 : null;
		const rows = await connection.any(sql.type(Draft)`
		SELECT id, created, updated, title, summary, description, type 
		FROM drafts
		WHERE email = ${email}
		${type ? sql.fragment`AND type = ${type}` : sql.fragment``}
		ORDER BY id 
		OFFSET ${cursor ?? null} 
		LIMIT ${adjustedLimit};`);

		return rows;
	});
}

async function store(data: DraftUpdate, email: string): Promise<Draft> {
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
		SELECT id, created, updated, title, summary, description, type 
		FROM drafts 
		WHERE id = ${id};`)

		if (!draft) throw new Error('Draft not found');
		return draft;
	});
}

async function update(id: number, data: DraftBody): Promise<Draft> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const result = await slonikUpdate(
			connection,
			'drafts',
			data,
			{ id }
		);
		if (result.rowCount === 0) {
			throw new Error('Draft not found');
		}
		const draft = await connection.maybeOne(sql.type(Draft)`
		  SELECT id, created, updated, title, summary, description, type 
		  FROM drafts 
		  WHERE id = ${id};
		`) as Draft;
		return filterNullValues(draft) as Draft;
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

async function count(): Promise<number> {
	const pool = await getPool();
	return await pool.connect(async (connection) => {
		const result = await connection.oneFirst(sql.type(number())`
        SELECT COUNT(*) FROM drafts;`);
		return Number(result);
	});
}

function factory(params: DraftUpdate = {}): PendingDraft {
	const defaultDraft = {
		title: faker.lorem.word({ length: { min: 8, max: 48 } }),
		summary: faker.lorem.sentence({ min: 5, max: 10 }),
		description: faker.lorem.paragraph({ min: 1, max: 3 }),
		type: faker.helpers.arrayElement(['topic', 'project'])
	};
	return { ...defaultDraft, ...params } as PendingDraft;
}

export default {
	index,
	store,
	show,
	update,
	destroy,
	count,
	factory
}
