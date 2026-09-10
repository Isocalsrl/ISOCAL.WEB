import {
    db,
} from "../../../database/db.js";

export async function createSession(
    adminId: number,
    tokenHash: string,
    expiresAt: Date,
): Promise<void> {
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        await client.query(
            `
                INSERT INTO admin_sessions (
                    admin_id,
                    token_hash,
                    expires_at
                )
                VALUES ($1, $2, $3)
            `,
            [
                adminId,
                tokenHash,
                expiresAt,
            ],
        );

        await client.query(
            `
                UPDATE admins
                SET
                    last_login_at =
                        CURRENT_TIMESTAMP,
                    updated_at =
                        CURRENT_TIMESTAMP
                WHERE id = $1
            `,
            [adminId],
        );

        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");

        throw error;
    } finally {
        client.release();
    }
}

export async function deleteSession(
    tokenHash: string,
): Promise<void> {
    await db.query(
        `
            DELETE FROM admin_sessions
            WHERE token_hash = $1
        `,
        [tokenHash],
    );
}

export async function deleteExpiredSessions():
    Promise<void> {
    await db.query(
        `
            DELETE FROM admin_sessions
            WHERE expires_at <=
                CURRENT_TIMESTAMP
        `,
    );
}
