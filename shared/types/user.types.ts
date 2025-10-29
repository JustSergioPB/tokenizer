import * as z from 'zod';
import type { Base } from './base.types';
import type { Org } from './org.types';

export const userTypes = ['investor', 'organization'] as const;
export type UserType = (typeof userTypes)[number];

export const loginSchema = z.object({
    email: z.email().min(1, 'fieldRequired'),
    password: z.string().min(1, 'fieldRequired'),
});

export const registerSchema = z.object({
    orgName: z.string().min(1, "fieldRequired").optional(),
    email: z.email("invalidEmail").min(1, "fieldRequired"),
    password: z.string()
        .min(8, "atLeast8Characters")
        .max(128, "max128Characters")
        .regex(/[A-Z]/, "atLeast1UppercaseLetter")
        .regex(/[a-z]/, "atLeast1LowercaseLetter")
        .regex(/[0-9]/, "atLeast1Number")
        .regex(/[^A-Za-z0-9]/, "atLeast1SpecialCharacter"),
});

export const forgotPasswordSchema = z.object({
    email: z.email("invalidEmail").min(1, "fieldRequired")
});

export const resetPasswordSchema = z.object({
    token: z.uuidv7().min(1, "fieldRequired"),
    password: z.string()
        .min(8, "atLeast8Characters")
        .max(128, "max128Characters")
        .regex(/[A-Z]/, "atLeast1UppercaseLetter")
        .regex(/[a-z]/, "atLeast1LowercaseLetter")
        .regex(/[0-9]/, "atLeast1Number")
        .regex(/[^A-Za-z0-9]/, "atLeast1SpecialCharacter"),
});

export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;

export type User = Base & {
    email: string;
    password: string;
    org?: Org;
};