import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "./index";
import { TEST_USER } from "./helpers";

const whitelist = [
    { method: 'GET', route: '/proposals' },
    { method: 'GET', route: '/health' },
];

async function clerkAuth(req: Request, res: Response, next: NextFunction) {
    // Bypass token auth for tests
    if (process.env.NODE_ENV === 'test') {
        req.user = TEST_USER;
        return next();
    }
    const token = req.headers.authorization?.replace("Bearer ", "");
    const base64Key = process.env.CLERK_JWT_KEY as string;
    const publicKey = Buffer.from(base64Key, 'base64').toString('ascii');
    const isWhitelisted = whitelist.some(
        (item) => item.method === req.method && item.route === req.path
    );

    // Parse user session token
    let userSession = {} as TokenPayload;
    let decodeError;

    try {
        if (token) {
            userSession = jwt.verify(token, publicKey) as TokenPayload;
        }
    } catch (error) {
        decodeError = error;
    }

    // Add user session regardless if whitelisted
    req.user = userSession;

    if (isWhitelisted) {
        return next();
    }

    if (token === undefined) {
        return res.status(401).json({ message: "not signed in" });
    }

    if (decodeError) {
        return res.status(400).json({ error: decodeError });
    }

    next();
}

async function logRequest(req: Request, res: Response, next: NextFunction) {
    if (process.env.LOG_REQUESTS) {
        console.log(`
            ${req.method} /${req.url}
            Body: ${JSON.stringify(req.body, null, 2)}
        `);
    }

    if (process.env.LOG_REQ_HEADERS === 'true') {
        console.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
    }
    next()

}

export { logRequest, clerkAuth };
