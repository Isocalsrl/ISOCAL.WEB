import type { Pool, PoolClient } from "pg";
import { db } from "../../database/db.js";
import { withTransaction } from "../../database/transaction.js";
import { toAdmin, toAdminWithPasswordHash, toLoginEvent, type AdminRow, type AdminWithPasswordHashRow, type LoginEventRow } from "./auth.mapper.js";
import type { Admin, AdminRole, AdminWithPasswordHash, CreateLoginEventInput, LoginEvent } from "./auth.types.js";
type Queryable = Pick<Pool | PoolClient, "query">;
const adminColumns = `
    id,
    name,
    email,
    role,
    is_active,
    last_login_at,
    created_at,
    updated_at
`;
export interface CreateAdminInput {
    name: string;
    email: string;
    passwordHash: string;
    role: AdminRole;
}
export async function createAdminIfMissing(input: CreateAdminInput): Promise<boolean> {
    const result = await db.query(`
            INSERT INTO admins (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
            RETURNING id
        `, [input.name, input.email, input.passwordHash, input.role]);
    return result.rowCount === 1;
}
export async function findAdminByEmail(email: string): Promise<AdminWithPasswordHash | null> {
    const result = await db.query<AdminWithPasswordHashRow>(`
            SELECT ${adminColumns}, password_hash
            FROM admins
            WHERE LOWER(email) = LOWER($1)
            LIMIT 1
        `, [email]);
    return result.rows[0] ? toAdminWithPasswordHash(result.rows[0]) : null;
}
export async function findAdminBySessionHash(tokenHash: string): Promise<Admin | null> {
    const result = await db.query<AdminRow>(`
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
            INNER JOIN admins ON admins.id = admin_sessions.admin_id
            WHERE admin_sessions.token_hash = $1
              AND admin_sessions.expires_at > CURRENT_TIMESTAMP
              AND admins.is_active = TRUE
            LIMIT 1
        `, [tokenHash]);
    return result.rows[0] ? toAdmin(result.rows[0]) : null;
}
export async function recordLoginEvent(input: CreateLoginEventInput, queryable: Queryable = db): Promise<void> {
    await queryable.query(`
            INSERT INTO admin_login_events (
                admin_id,
                attempted_email,
                outcome,
                ip_address,
                user_agent
            )
            VALUES ($1, $2, $3, $4, $5)
        `, [
        input.adminId,
        input.attemptedEmail,
        input.outcome,
        input.ipAddress,
        input.userAgent,
    ]);
}
export async function findRecentLoginEvents(limit = 100): Promise<LoginEvent[]> {
    const result = await db.query<LoginEventRow>(`
            SELECT
                events.id,
                events.admin_id,
                admins.name AS admin_name,
                events.attempted_email,
                events.outcome,
                events.ip_address,
                events.user_agent,
                events.occurred_at
            FROM admin_login_events AS events
            LEFT JOIN admins ON admins.id = events.admin_id
            ORDER BY events.occurred_at DESC, events.id DESC
            LIMIT $1
        `, [limit]);
    return result.rows.map(toLoginEvent);
}
export async function createSession(adminId: number, tokenHash: string, expiresAt: Date, loginEvent: CreateLoginEventInput): Promise<void> {
    await withTransaction(async (client) => {
        await client.query(`
                INSERT INTO admin_sessions (admin_id, token_hash, expires_at)
                VALUES ($1, $2, $3)
            `, [adminId, tokenHash, expiresAt]);
        await client.query(`
                UPDATE admins
                SET last_login_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
            `, [adminId]);
        await recordLoginEvent(loginEvent, client);
    });
}
export async function deleteSession(tokenHash: string): Promise<void> {
    await db.query("DELETE FROM admin_sessions WHERE token_hash = $1", [tokenHash]);
}
export async function deleteExpiredSessions(): Promise<void> {
    await db.query("DELETE FROM admin_sessions WHERE expires_at <= CURRENT_TIMESTAMP");
}

export async function findAdmins(): Promise<Admin[]> {
    const result = await db.query<AdminRow>(`
        SELECT ${adminColumns}
        FROM admins
        ORDER BY CASE WHEN role = 'super_admin' THEN 0 ELSE 1 END, created_at ASC, id ASC
    `);
    return result.rows.map(toAdmin);
}

export async function createAdmin(input: CreateAdminInput): Promise<Admin> {
    const result = await db.query<AdminRow>(`
        INSERT INTO admins (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING ${adminColumns}
    `, [input.name, input.email, input.passwordHash, input.role]);
    return toAdmin(result.rows[0]);
}

export async function setAdminActive(id: number, isActive: boolean): Promise<Admin | null> {
    const result = await db.query<AdminRow>(`
        UPDATE admins
        SET is_active = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND role = 'admin'
        RETURNING ${adminColumns}
    `, [id, isActive]);
    return result.rows[0] ? toAdmin(result.rows[0]) : null;
}
