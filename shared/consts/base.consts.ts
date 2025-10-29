import type { ErrorCode } from "../types/base.types";

export const HTTP_ERROR_MAP: Record<ErrorCode, number> = {
    unprocessableEntity: 422,
    internalServerError: 500,
};