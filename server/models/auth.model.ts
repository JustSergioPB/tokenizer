import type { ForgotPassword, Login, Register, ResetPassword, User } from "#shared/types/user.types";
import * as uuid from 'uuid';
import * as bcrypt from 'bcryptjs';
import * as UserRepository from "../repositories/user.repository";
import * as TokenRepository from "../repositories/token.repository";
import { UserError } from "#shared/errors/user.errors";
import type { Token } from "#shared/types/token.types";
import { TokenError } from "#shared/errors/token.errors";

export const register = ({ email, password, orgName }: Register): Promise<User> => {
    const timestamp = new Date();

    return UserRepository.register({
        id: uuid.v7(),
        email,
        password: bcrypt.hashSync(password),
        createdAt: timestamp,
        updatedAt: timestamp,
    }, orgName ? {
        id: uuid.v7(),
        name: orgName,
        createdAt: timestamp,
        updatedAt: timestamp,
    } : undefined);
};

export const login = async ({ email, password }: Login): Promise<User> => {
    const user = await UserRepository.findByEmail(email);

    if (!user) throw new UserError('NotFound');
    if (!bcrypt.compareSync(password, user.password)) throw new UserError('BadCredentials');

    return user;
}

export const requestPasswordReset = async ({ email }: ForgotPassword): Promise<Token> => {
    const user = await UserRepository.findByEmail(email);

    if (!user) throw new UserError("NotFound");

    const timestamp = new Date();

    return TokenRepository.create({
        id: uuid.v7(),
        expiresAt: new Date(timestamp.getTime() + 5 * 60 * 1000), // 5 minutes
        createdAt: timestamp,
        updatedAt: timestamp
    }, user);
}

export const resetPassword = async ({ token: id, password }: ResetPassword): Promise<void> => {
    const token = await TokenRepository.findByIdWithUser(id);

    if (!token) throw new TokenError("NotFound");
    if (token.expiresAt < new Date()) throw new TokenError("AlreadyExpired");
    if (token.createdAt !== token.updatedAt) throw new TokenError("AlreadyUsed");

    const timestamp = new Date();

    await UserRepository.updatePassword({
        id: token.user.id,
        updatedAt: timestamp,
        password: bcrypt.hashSync(password)
    }, {
        id: token.id,
        updatedAt: timestamp
    });
}