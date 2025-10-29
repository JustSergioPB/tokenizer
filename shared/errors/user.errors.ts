export const errorCodes = [
    'BadCredentials',
    'NotFound',
    'EmailInUse'
] as const;
export type ErrorCode = (typeof errorCodes)[number];

export class UserError extends Error {
    constructor(public code: ErrorCode) {
        super(`user${code}`);
    }
}