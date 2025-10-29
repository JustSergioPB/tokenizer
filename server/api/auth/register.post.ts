import * as AuthModel from "~~/server/models/auth.model";
import { HTTP_ERROR_MAP as USER_HTTP_ERROR_MAP } from "#shared/consts/user.consts";
import { HTTP_ERROR_MAP as ORG_HTTP_ERROR_MAP } from "#shared/consts/org.consts";
import { HTTP_ERROR_MAP as BASE_HTTP_ERROR_MAP } from "#shared/consts/base.consts";
import { UserError } from "#shared/errors/user.errors";
import { OrgError } from "#shared/errors/org.errors";
import { registerSchema } from "#shared/types/user.types";

export default defineEventHandler(async (event) => {
    const { success, data } = await readValidatedBody(event, registerSchema.safeParse);

    if (!success) {
        throw createError({
            statusCode: BASE_HTTP_ERROR_MAP['unprocessableEntity'],
            message: 'unprocessableEntity',
        });
    }

    try {
        const user = await AuthModel.register(data);
        await setUserSession(event, { user, maxAge: 60 * 60 * 4, });
        return {};
    } catch (error) {
        if (error instanceof UserError) {
            throw createError({
                statusCode: USER_HTTP_ERROR_MAP[error.code],
                message: error.message,
            });
        };
        if (error instanceof OrgError) {
            throw createError({
                statusCode: ORG_HTTP_ERROR_MAP[error.code],
                message: error.message,
            });
        };
        throw createError({
            statusCode: BASE_HTTP_ERROR_MAP['internalServerError'],
            message: 'internalServerError',
        });
    }
});