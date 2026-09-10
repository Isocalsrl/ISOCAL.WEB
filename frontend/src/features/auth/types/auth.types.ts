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

export type AuthStatus =
    | "loading"
    | "authenticated"
    | "anonymous"
    | "error";
