import { getPool } from '../database';
import { sql } from 'slonik';
import {Proposal} from "../types/proposal";

async function getWinner(): Promise<Proposal> {
    const pool = await getPool();
    return await pool.connect(async (connection) => {
        const leadingProposal = await connection.one(sql.type(Proposal)`
        WITH leading_proposal AS (
          SELECT p.*, COUNT(v.vote) as vote_count
          FROM proposals p
          JOIN votes v ON p.id = v.proposal_id
          WHERE p.status = 'open'
          GROUP BY p.id
          ORDER BY vote_count DESC
          LIMIT 1
        )
        UPDATE proposals
        SET status = 'closed'
        FROM leading_proposal
        WHERE proposals.id = leading_proposal.id
        RETURNING proposals.*;`);
        return leadingProposal;
    });
}

export default { getWinner }