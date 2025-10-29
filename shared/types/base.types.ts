export const errorCodes = ['unprocessableEntity', 'internalServerError'] as const;
export type ErrorCode = (typeof errorCodes)[number];

export type Base = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export type PartialWithId<T> = Partial<T> & { id: string };