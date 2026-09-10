import type {
    Admin,
    AdminWithPasswordHash,
} from "./auth.types.js";

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

export interface AdminWithPasswordHashRow
    extends AdminRow {
    password_hash: string;
}

export function toAdmin(
    row: AdminRow,
): Admin {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        isActive: row.is_active,
        lastLoginAt: row.last_login_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export function toAdminWithPasswordHash(
    row: AdminWithPasswordHashRow,
): AdminWithPasswordHash {
    return {
        ...toAdmin(row),
        passwordHash: row.password_hash,
    };
}
