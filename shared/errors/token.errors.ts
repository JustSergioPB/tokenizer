export const errorCodes = [
    'AlreadyExpired',
    'NotFound',
    'AlreadyUsed',
] as const;
export type ErrorCode = (typeof errorCodes)[number];

export class TokenError extends Error {
    constructor(public code: ErrorCode) {
        super(`token${code}`);
    }
}