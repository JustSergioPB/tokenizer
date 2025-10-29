import type { ErrorCode } from "../errors/org.errors";

export const HTTP_ERROR_MAP: Record<ErrorCode, number> = {
    NotFound: 404,
    NameInUse: 400,
};