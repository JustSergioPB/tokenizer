import type { Token, TokenWithUser } from "#shared/types/token.types";
import type { User } from "#shared/types/user.types";

export const create = (input: Token, user: User): Promise<Token> => useDrizzle()
    .insert(tables.tokens)
    .values({ ...input, userId: user.id })
    .returning()
    .get();

export const findByIdWithUser = (id: string): Promise<TokenWithUser | undefined> => useDrizzle()
    .query.tokens
    .findFirst({
        where: eq(tables.tokens.id, id),
        with: {
            user: true,
        }
    });