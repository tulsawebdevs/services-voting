import { getPool } from '../database';
import {sql} from 'slonik';
import { Proposal } from "../types/proposal";

async function getWinner(): Promise<Proposal> {
    const pool = await getPool();
    return await pool.connect(async (connection) => {
        const proposals = await connection.any(sql.type(Proposal)`
            SELECT p.*
            FROM proposals p
                JOIN votes v ON p.id = v.proposal_id
            WHERE p.status = 'open'
            GROUP BY p.id
            HAVING SUM(v.vote) = (
                SELECT MAX(vote_sum)
                FROM (
                        SELECT SUM(v.vote) as vote_sum
                        FROM proposals p
                            JOIN votes v ON p.id = v.proposal_id
                        WHERE p.status = 'open'
                        GROUP BY p.id
                     ) as subquery
            )
        `);
        if (proposals.length === 0) {
            throw new Error('No open proposals found');
        }
        const randomIndex = Math.floor(Math.random() * proposals.length);
        const chosenProposal = proposals[randomIndex];
        const updatedProposal = await connection.one(sql.type(Proposal)`
            UPDATE proposals
            SET status = 'closed'
            WHERE id = ${chosenProposal.id}
            RETURNING *
        `);

        return updatedProposal;
    });
}

export default { getWinner };