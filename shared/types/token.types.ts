import type { Base } from "./base.types";
import type { User } from "./user.types";

export type Token = Base & {
    expiresAt: Date;
};

export type TokenWithUser = Token & {
    user: User;
}