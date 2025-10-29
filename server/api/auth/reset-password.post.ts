import * as AuthModel from "~~/server/models/auth.model";
import { resetPasswordSchema } from "#shared/types/user.types";
import { HTTP_ERROR_MAP as BASE_HTTP_ERROR_MAP } from "#shared/consts/base.consts";
import { HTTP_ERROR_MAP as USER_HTTP_ERROR_MAP } from "#shared/consts/user.consts";
import { HTTP_ERROR_MAP as TOKEN_HTTP_ERROR_MAP } from "#shared/consts/token.consts";
import { UserError } from "#shared/errors/user.errors";
import { TokenError } from "#shared/errors/token.errors";

export default defineEventHandler(async (event) => {
    const { success, data } = await readValidatedBody(event, resetPasswordSchema.safeParse);

    if (!success) {
        throw createError({
            statusCode: BASE_HTTP_ERROR_MAP['unprocessableEntity'],
            message: 'unprocessableEntity',
        });
    }

    try {
        await AuthModel.resetPassword(data);
        return {};
    } catch (error) {
        if (error instanceof UserError) {
            throw createError({
                statusCode: USER_HTTP_ERROR_MAP[error.code],
                message: error.message,
            });
        };

        if (error instanceof TokenError) {
            throw createError({
                statusCode: TOKEN_HTTP_ERROR_MAP[error.code],
                message: error.message,
            });
        }

        throw createError({
            statusCode: BASE_HTTP_ERROR_MAP['internalServerError'],
            message: 'internalServerError',
        });
    }
})