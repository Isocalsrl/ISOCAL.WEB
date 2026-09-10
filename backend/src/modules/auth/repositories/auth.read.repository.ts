import { db } from "../../../database/db.js";
import {
    toAdmin,
    toAdminWithPasswordHash,
    type AdminRow,
    type AdminWithPasswordHashRow,
} from "../auth.mapper.js";
import type {
    Admin,
    AdminWithPasswordHash,
} from "../auth.types.js";
import {
    ADMIN_COLUMNS,
} from "./auth.repository.constants.js";

export async function findAdminByEmail(
    email: string,
): Promise<AdminWithPasswordHash | null> {
    const result =
        await db.query<AdminWithPasswordHashRow>(
            `
                SELECT
                    ${ADMIN_COLUMNS},
                    password_hash
                FROM admins
                WHERE LOWER(email) = LOWER($1)
                LIMIT 1
            `,
            [email],
        );

    return result.rows[0]
        ? toAdminWithPasswordHash(
                result.rows[0],
            )
        : null;
}

export async function findAdminBySessionHash(
    tokenHash: string,
): Promise<Admin | null> {
    const result =
        await db.query<AdminRow>(
            `
                SELECT
                    admins.id,
                    admins.name,
                    admins.email,
                    admins.role,
                    admins.is_active,
                    admins.last_login_at,
                    admins.created_at,
                    admins.updated_at
                FROM admin_sessions
                INNER JOIN admins
                    ON admins.id =
                        admin_sessions.admin_id
                WHERE
                    admin_sessions.token_hash = $1
                    AND
                    admin_sessions.expires_at >
                        CURRENT_TIMESTAMP
                    AND
                    admins.is_active = TRUE
                LIMIT 1
            `,
            [tokenHash],
        );

    return result.rows[0]
        ? toAdmin(result.rows[0])
        : null;
}
