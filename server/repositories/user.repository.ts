import type { User } from "#shared/types/user.types"
import type { Token } from "#shared/types/token.types";
import type { PartialWithId } from "~~/shared/types/base.types";

export const register = async (user: User, org?: Org): Promise<User> => {
    const db = useDrizzle();

    const [insertedUsers, insertedOrgs] = await db.batch([
        db.insert(tables.users).values({
            id: user.id,
            orgId: user.org ? user.org.id : null,
            email: user.email,
            password: user.password,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning(),
        ...(org ? [db.insert(tables.organizations).values({
            id: org.id,
            name: org.name,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning()] : []),
    ]);

    return {
        ...insertedUsers[0],
        org: user.org ? insertedOrgs[0] : undefined,
    }
}

export const findByEmail = (email: string): Promise<User | undefined> => useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

export const updatePassword = async (user: PartialWithId<User>, token: PartialWithId<Token>): Promise<void> => {
    const db = useDrizzle();

    await db.batch([
        db.update(tables.users).set(user).where(eq(tables.users.id, user.id)),
        db.update(tables.tokens).set(token).where(eq(tables.tokens.id, token.id)),
    ]);
}