import { DatabasePool } from 'slonik';
import { createPool } from 'slonik';

const DB_URL = process.env.DB_URL || 'postgres://postgres:postgres@db:5432/postgres';
let pool: DatabasePool;

export async function getPool(){
	if (pool) return pool;
	pool = await createPool(DB_URL);
	return pool;
}
