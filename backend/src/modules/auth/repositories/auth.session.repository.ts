import { db } from "../../../database/db.js";
import { withTransaction } from "../../../database/transaction.js";
import type { CreateLoginEventInput } from "../auth.types.js";
import { recordLoginEvent } from "./auth.login-event.repository.js";

export async function createSession(
    adminId: number,
    tokenHash: string,
    expiresAt: Date,
    loginEvent: CreateLoginEventInput,
): Promise<void> {
    await withTransaction(async (client) => {
        await client.query(
            `
                INSERT INTO admin_sessions (
                    admin_id,
                    token_hash,
                    expires_at
                )
                VALUES ($1, $2, $3)
            `,
            [adminId, tokenHash, expiresAt],
        );

        await client.query(
            `
                UPDATE admins
                SET
                    last_login_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
            `,
            [adminId],
        );

        await recordLoginEvent(loginEvent, client);
    });
}

export async function deleteSession(tokenHash: string): Promise<void> {
    await db.query(
        `
            DELETE FROM admin_sessions
            WHERE token_hash = $1
        `,
        [tokenHash],
    );
}

export async function deleteExpiredSessions(): Promise<void> {
    await db.query(
        `
            DELETE FROM admin_sessions
            WHERE expires_at <= CURRENT_TIMESTAMP
        `,
    );
}
