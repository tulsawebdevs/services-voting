import express from 'express';
import WinnerService from '../services/winner'

const router = express.Router();

router.get("/", async  (req, res) => {
    try {
        const winner = WinnerService.getWinner();
        return res.status(200).json(winner)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Server Error' })
    }
})

export default router;