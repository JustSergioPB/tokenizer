import { loginSchema } from "#shared/types/user.types";
import { HTTP_ERROR_MAP as USER_HTTP_ERROR_MAP } from "#shared/consts/user.consts";
import { HTTP_ERROR_MAP as BASE_HTTP_ERROR_MAP } from "#shared/consts/base.consts";
import * as AuthModel from "~~/server/models/auth.model";
import { UserError } from "#shared/errors/user.errors";

export default defineEventHandler(async (event) => {
    const { success, data } = await readValidatedBody(event, loginSchema.safeParse);

    if (!success) {
        throw createError({
            statusCode: BASE_HTTP_ERROR_MAP['unprocessableEntity'],
            message: 'unprocessableEntity',
        });
    }

    try {
        const user = await AuthModel.login(data);
        await setUserSession(event, { user, maxAge: 60 * 60 * 4, });
        return {};
    } catch (error) {
        if (error instanceof UserError) {
            throw createError({
                statusCode: USER_HTTP_ERROR_MAP[error.code],
                message: error.message,
            });
        };
        throw createError({
            statusCode: 500,
            message: 'internalServerError',
        });
    }
});
