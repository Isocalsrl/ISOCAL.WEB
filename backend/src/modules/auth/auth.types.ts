import type { AdminRole } from "../../shared/auth/adminRole.js";

export type { AdminRole } from "../../shared/auth/adminRole.js";
export interface Admin {
    id: number;
    name: string;
    email: string;
    role: AdminRole;
    isActive: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface AdminWithPasswordHash extends Admin {
    passwordHash: string;
}
export interface LoginInput {
    email: string;
    password: string;
}
export interface LoginResult {
    admin: Admin;
    sessionToken: string;
    expiresAt: Date;
}
export interface LoginMetadata {
    ipAddress: string | null;
    userAgent: string | null;
}
export type LoginOutcome = "success" | "invalid_credentials" | "inactive_account";
export interface CreateLoginEventInput extends LoginMetadata {
    adminId: number | null;
    attemptedEmail: string;
    outcome: LoginOutcome;
}
export interface LoginEvent {
    id: number;
    adminId: number | null;
    adminName: string | null;
    attemptedEmail: string;
    outcome: LoginOutcome;
    ipAddress: string | null;
    userAgent: string | null;
    occurredAt: Date;
}
declare global {
    namespace Express {
        interface Request {
            admin?: Admin;
        }
    }
}
