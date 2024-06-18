import express from 'express';
import WinnerService from '../services/winner'
import config from '../config'

const router = express.Router();

router.get("/", async  (req, res) => {
    const { userEmail } = req.user;
    const { admins } = config;
    if (!admins.includes(userEmail)) {
        res.status(401).json({message: 'Unauthorized'})
    }
    try {
        const winner = await WinnerService.getWinner();
        return res.status(200).json(winner)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Server Error' })
    }
})

export default router;