import type { ErrorCode } from "../errors/user.errors";

export const HTTP_ERROR_MAP: Record<ErrorCode, number> = {
    BadCredentials: 401,
    NotFound: 404,
    EmailInUse: 400,
};