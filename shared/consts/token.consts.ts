import type { ErrorCode } from "../errors/token.errors";

export const HTTP_ERROR_MAP: Record<ErrorCode, number> = {
    NotFound: 404,
    AlreadyExpired: 410,
    AlreadyUsed: 410,
};