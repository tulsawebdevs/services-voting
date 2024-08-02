import express from 'express';
import WinnerService from '../services/winner'
import config from '../config'
import { NotFoundError } from '../helpers';

const router = express.Router();

router.get("/", async (req, res) => {
    const { userEmail } = req.user;
    const { admins } = config;
    if (!admins.includes(userEmail)) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    try {
        const winner = await WinnerService.getWinner();
        return res.status(200).json(winner)
    } catch (e) {
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Server Error' })
    }
})

export default router;