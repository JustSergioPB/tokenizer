export const errorCodes = [
    'NotFound',
    'NameInUse'
] as const;
export type ErrorCode = (typeof errorCodes)[number];

export class OrgError extends Error {
    constructor(public code: ErrorCode) {
        super(`org${code}`);
    }
}