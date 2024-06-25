import { sql } from 'slonik';
import { getPool } from '../../database';
import { z } from "zod";

async function assertDatabaseHas(table: string, conditions: Record<string, any>) {
    const pool = await getPool();
    const conditionFragments = Object.keys(conditions).map(key =>
        sql.fragment`${sql.identifier([key])} = ${conditions[key]}`
    );
    const whereCondition = sql.join(conditionFragments, sql.fragment` AND `);
    const query = sql.unsafe`
        SELECT EXISTS (
            SELECT 1
            FROM ${sql.identifier([table])}
            WHERE ${whereCondition}
        ) AS "exists";
    `;
    const result = await pool.connect(async (connection : any) => {
        return connection.oneFirst(query);
    });
    if (!result) {
        throw new Error(`Record does not exist in ${table} with conditions: ${JSON.stringify(conditions)}`);
    }
}

export default assertDatabaseHas;