import { getPool } from '../database';

async function index() {
	const pool = await getPool();
	return pool.connect(async (connection) => {
		console.log('Fetching proposals...');
	});
}

export default {
	index
}
