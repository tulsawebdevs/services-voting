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

export type TestToken = Pick<TokenPayload, 'userEmail' | 'userFullName'>;

declare global {
    namespace Express {
        interface Request {
            validated: { body?: object, query?: object, params?: object }
            user: TokenPayload | TestToken
        }
    }
}
