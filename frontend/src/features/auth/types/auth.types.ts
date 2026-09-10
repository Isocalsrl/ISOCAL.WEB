export type AdminRole =
    | "admin"
    | "super_admin";

export interface Admin {
    id: number;
    name: string;
    email: string;
    role: AdminRole;
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthData {
    admin: Admin;
}

export type LoginOutcome =
    | "success"
    | "invalid_credentials"
    | "inactive_account";

export interface LoginEvent {
    id: number;
    adminId: number | null;
    adminName: string | null;
    attemptedEmail: string;
    outcome: LoginOutcome;
    ipAddress: string | null;
    userAgent: string | null;
    occurredAt: string;
}

export type AuthStatus =
    | "loading"
    | "authenticated"
    | "anonymous"
    | "error";
