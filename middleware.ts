import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "./index";

const whitelist = [
    { method: 'GET', route: '/proposals' },
    { method: 'GET', route: '/health' },
];

async function clerkAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const base64Key = process.env.CLERK_JWT_KEY as string;
    const publicKey = Buffer.from(base64Key, 'base64').toString('ascii');
    const isWhitelisted = whitelist.some(
        (item) => item.method === req.method && item.route === req.path
    );

    if (isWhitelisted) {
        req.user = {} as TokenPayload;
        return next();
    }

    if (token === undefined) {
        return res.status(401).json({ message: "not signed in" });
    }

    try {
        const decoded = jwt.verify(token, publicKey) as TokenPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ error });
    }
}

async function logRequest(req: Request, res: Response, next: NextFunction) {
    console.log(`
		${req.method} ${req.url}
		Body: ${JSON.stringify(req.body)}
		Headers: ${JSON.stringify(req.headers, null, 2)}
	`);
    next()
}

export { logRequest, clerkAuth };