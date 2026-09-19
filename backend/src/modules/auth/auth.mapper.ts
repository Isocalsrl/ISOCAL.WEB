import type { Admin, AdminWithPasswordHash, LoginEvent, LoginOutcome } from "./auth.types.js";
export interface AdminRow {
    id: number;
    name: string;
    email: string;
    role: "admin" | "super_admin";
    is_active: boolean;
    last_login_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
export interface AdminWithPasswordHashRow extends AdminRow {
    password_hash: string;
}
export interface LoginEventRow {
    id: string | number;
    admin_id: number | null;
    admin_name: string | null;
    attempted_email: string;
    outcome: LoginOutcome;
    ip_address: string | null;
    user_agent: string | null;
    occurred_at: Date;
}
export function toAdmin(row: AdminRow): Admin {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        isActive: Boolean(row.is_active),
        lastLoginAt: row.last_login_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
export function toAdminWithPasswordHash(row: AdminWithPasswordHashRow): AdminWithPasswordHash {
    return {
        ...toAdmin(row),
        passwordHash: row.password_hash,
    };
}
export function toLoginEvent(row: LoginEventRow): LoginEvent {
    return {
        id: Number(row.id),
        adminId: row.admin_id,
        adminName: row.admin_name,
        attemptedEmail: row.attempted_email,
        outcome: row.outcome,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        occurredAt: row.occurred_at,
    };
}
