import {
    db,
} from "../../../database/db.js";
import type {
    AdminRole,
} from "../auth.types.js";

export interface CreateAdminInput {
    name: string;
    email: string;
    passwordHash: string;
    role: AdminRole;
}

export async function createAdminIfMissing(
    input: CreateAdminInput,
): Promise<boolean> {
    const result = await db.query(
        `
            INSERT INTO admins (
                name,
                email,
                password_hash,
                role
            )
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
            RETURNING id
        `,
        [
            input.name,
            input.email,
            input.passwordHash,
            input.role,
        ],
    );

    return result.rowCount === 1;
}
