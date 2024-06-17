import { getPool } from '../database';
import { sql } from 'slonik';
import { Proposal } from "../types/proposal";

async function getWinner(): Promise<Proposal> {
    const pool = await getPool();
    return await pool.connect(async (connection) => {
        const leadingVoteCount = await connection.oneFirst(sql.typeAlias('int')`
            SELECT COUNT(v.vote) as vote_count
            FROM proposals p
            JOIN votes v ON p.id = v.proposal_id
            WHERE p.status = 'open'
            GROUP BY p.id
            ORDER BY vote_count DESC
            LIMIT 1
        `);
        const tiedProposals = await connection.any(sql.type(Proposal)`
            SELECT p.*
            FROM proposals p
            JOIN votes v ON p.id = v.proposal_id
            WHERE p.status = 'open' 
              AND (SELECT COUNT(vote) FROM votes WHERE proposal_id = p.id) = ${leadingVoteCount}
            GROUP BY p.id
        `);
        if (tiedProposals.length === 0) {
            throw new Error('No open proposals found');
        }
        const randomIndex = Math.floor(Math.random() * tiedProposals.length);
        const chosenProposal = tiedProposals[randomIndex];
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