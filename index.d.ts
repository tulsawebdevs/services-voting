export interface TokenPayload {
    azp: string[];
    exp: number;
    iat: number;
    iss: string;
    nbf: number;
    sid: string;
    sub: string;
    userEmail: string;
    userFullName: string;
}

declare global {
    namespace Express {
        interface Request {
            validated: { body?: object, query?: object, params?: object }
            user: TokenPayload
        }
    }
}